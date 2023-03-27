import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseInterceptors,
  UploadedFile,
  Header,
  UseGuards,
  HttpStatus,
  StreamableFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Stream } from 'stream';
import { FileUploadTypes, Genders } from 'types';

import { User } from 'src/users/entities/user.entity';
import { AuthenticationGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserInfo } from 'src/auth/decorators/user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { defaultMaxSize } from 'src/common/const';
import { fileMimetypeFilter } from 'src/utils';

import { AlertsService } from './alerts.service';
import { CreateAlertDto } from './dto/create-alert.dto';
import { UpdateAlertDto } from './dto/update-alert.dto';
import { AlertWidget } from './entities/alert-widget.entity';

@ApiTags('Alerts')
@Controller('widgets/alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Post()
  @Roles('creators')
  @UseGuards(RolesGuard)
  @UseGuards(AuthenticationGuard)
  create(@UserInfo() user: User, @Body() createAlertDto: CreateAlertDto) {
    return this.alertsService.create(user, createAlertDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.alertsService.findOne(id);
  }

  @Get('creator/:userId')
  findOneByCreatorId(@Param('userId') userId: string) {
    return this.alertsService.findOneByCreator(userId);
  }

  @Patch(':id')
  @Roles('creators')
  @UseGuards(RolesGuard)
  @UseGuards(AuthenticationGuard)
  @UseInterceptors(
    FileInterceptor(FileUploadTypes.alert, {
      fileFilter: fileMimetypeFilter('png', 'jpeg', 'jpg', 'gif'),
      limits: {
        fileSize: defaultMaxSize,
      },
    }),
  )
  @ApiOperation({ summary: 'Update alert widget' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateAlertDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: AlertWidget,
  })
  update(
    @UserInfo() user: User,
    @Param('id') id: string,
    @Body() updateAlertDto: UpdateAlertDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.alertsService.update(user, id, updateAlertDto, file);
  }

  @Post('sound')
  @Roles('creators')
  @UseGuards(RolesGuard)
  @UseGuards(AuthenticationGuard)
  @UseInterceptors(
    FileInterceptor(FileUploadTypes.sound, {
      fileFilter: fileMimetypeFilter('audio'),
    }),
  )
  @ApiOperation({ summary: 'Upload user custom sounds for alerts widget' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: [FileUploadTypes.sound],
      properties: {
        [FileUploadTypes.sound]: {
          type: 'file',
          format: 'binary',
        },
      },
    },
  })
  uploadSound(
    @UserInfo('username') username: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.alertsService.uploadSound(username, file);
  }

  @Get('generate/sound')
  @Header('Content-Type', 'audio/mpeg')
  @Header('Transfer-Encoding', 'chunked')
  async generateSound(
    @Query('text') text: string,
    @Query('genderVoice') genderVoice: Genders,
  ) {
    const audioContent = await this.alertsService.generateSound(
      text,
      genderVoice,
    );

    if (audioContent) {
      const bufferStream = new Stream.PassThrough();
      bufferStream.end(Buffer.from(audioContent));
      return new StreamableFile(bufferStream);
    }
  }
}

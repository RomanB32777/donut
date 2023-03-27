import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Req,
  Res,
  HttpStatus,
  UseGuards,
  Query,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthenticationGuard } from 'src/auth/guards/auth.guard';
import { User } from 'src/users/entities/user.entity';

import { AuthService } from './auth.service';
import { UserInfo } from './decorators/user.decorator';
import { UserLoginDto, UserTokenPayloadDto } from './dto/user-payload.dto';
import { ConfirmQueryDto } from './dto/confirm-query.dto';
import { EmaiBodyDto, ResetPasswordBodyDto } from './dto/reset-password.dto';
import { AuthJwtToken } from './decorators/token.decorator';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: User,
  })
  login(@Body() createUserDto: UserLoginDto) {
    return this.authService.login(createUserDto);
  }

  @Post('registration')
  @ApiOperation({ summary: 'Registration' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: User,
  })
  registration(@Req() req: Request, @Body() createUserDto: CreateUserDto) {
    const confirmLink = `${req.protocol}://${req.get(
      'Host',
    )}${req.originalUrl.replace('registration', 'confirm')}`;
    return this.authService.registration(createUserDto, confirmLink);
  }

  @Post('resend')
  @ApiOperation({ summary: 'Resend confirm letter' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
  })
  resendConfirmLetter(@Req() req: Request, @Body() { email }: EmaiBodyDto) {
    const confirmLink = `${req.protocol}://${req.get(
      'Host',
    )}${req.originalUrl.replace('resend', 'confirm')}`;
    return this.authService.resendConfirmLetter(email, confirmLink);
  }

  @Get('confirm')
  @ApiOperation({ summary: 'Confirm email' })
  async confirm(@Res() res: Response, @Query() params: ConfirmQueryDto) {
    const confirmRes = await this.authService.confirm(params);
    return res.redirect(confirmRes);
  }

  @Get('check/:tokenId')
  @ApiOperation({ summary: 'Check token' })
  async checkToken(@Param('tokenId') tokenId: string) {
    const { access_token, verify_data } = await this.authService.checkToken(
      tokenId,
    );
    return { access_token, ...verify_data };
  }

  @Get('verify/:token')
  @ApiOperation({ summary: 'Verify token' })
  async verifyToken(@Param('token') token: string) {
    return this.authService.verifyToken(token);
  }

  @Post('reset')
  @ApiOperation({ summary: 'Reset password' })
  resetPassword(@Body() { email }: EmaiBodyDto) {
    return this.authService.resetPassword(email);
  }

  @Patch('reset')
  @UseGuards(AuthenticationGuard)
  @ApiOperation({ summary: 'Set new password' })
  setPassword(
    @AuthJwtToken() authToken: string,
    @UserInfo() user: UserTokenPayloadDto,
    @Body() { password }: ResetPasswordBodyDto,
  ) {
    return this.authService.changePassword(user, password, authToken);
  }
}

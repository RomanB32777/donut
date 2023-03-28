import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import googlePkg from '@google-cloud/text-to-speech/build/protos/protos.js';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { Genders, IStaticFile } from 'types';

import { getDefaultValues, getRepositoryFields } from 'src/utils';
import { FilesService } from 'src/files/files.service';
import { User } from 'src/users/entities/user.entity';
import { CreateAlertDto } from './dto/create-alert.dto';
import { UpdateAlertDto } from './dto/update-alert.dto';
import { AlertWidget } from './entities/alert-widget.entity';

@Injectable()
export class AlertsService {
  constructor(
    private readonly fileService: FilesService,

    @InjectRepository(AlertWidget)
    private alertsRepository: Repository<AlertWidget>,
  ) {}

  async create(user: User, createdWidget: CreateAlertDto) {
    const newWidget = await this.alertsRepository.save({
      ...createdWidget,
      creator: user,
    });
    if (newWidget) await this.setDefaultSound(newWidget.id);
    return newWidget;
  }

  async findOne(id: string) {
    return await this.alertsRepository.findOneByOrFail({ id });
  }

  async findOneByCreator(userId: string) {
    const selectFields = getRepositoryFields(this.alertsRepository, [
      'createdAt',
      'updatedAt',
      'deletedAt',
    ]);
    return await this.alertsRepository.findOneOrFail({
      select: selectFields,
      where: {
        creator: { id: userId },
      },
    });
  }

  async generateSound(text: string, genderVoice: Genders) {
    const voiceName =
      genderVoice === Genders.FEMALE ? 'en-US-Neural2-C' : 'en-US-Neural2-A';

    const request: googlePkg.google.cloud.texttospeech.v1.ISynthesizeSpeechRequest =
      {
        input: { text: text.replaceAll('*', '') },
        voice: {
          languageCode: 'en-US',
          name: voiceName,
          ssmlGender: genderVoice,
        },
        audioConfig: { audioEncoding: 'MP3' },
      };

    const speechClient = new TextToSpeechClient();
    const [response] = await speechClient.synthesizeSpeech(request);
    return response.audioContent;
  }

  uploadSound(userId: string, file: Express.Multer.File): IStaticFile {
    return this.fileService.uploadFile(file, userId, 'sound', true);
  }

  async setDefaultSound(id: string) {
    const [sound] = this.fileService.getAssetsFiles('sound');
    if (sound) {
      await this.alertsRepository.update({ id }, { sound: sound.path });
    }
  }

  async update(
    user: User,
    id: string,
    updateAlertDto: UpdateAlertDto,
    file?: Express.Multer.File,
  ) {
    const { id: userId } = user;
    const { isReset, ...alertData } = updateAlertDto;

    if (isReset) {
      const columns = getDefaultValues(this.alertsRepository);
      await this.alertsRepository.update(
        { id, creator: { id: userId } },
        { ...columns },
      );
      await this.setDefaultSound(id);
    } else {
      if (file) {
        const { path } = this.fileService.uploadFile(file, userId, 'alert');
        alertData.banner = path;
      }

      await this.alertsRepository.update(
        { id, creator: { id: userId } },
        { ...alertData },
      );
    }

    return await this.findOne(id);
  }
}

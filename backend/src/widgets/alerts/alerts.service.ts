import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import googlePkg from '@google-cloud/text-to-speech/build/protos/protos.js';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { IStaticFile } from 'types';

import { getDefaultValues, getRepositoryFields } from 'src/utils';
import { languageCodes, languageVoices } from 'src/common/const';
import { FilesService } from 'src/files/files.service';
import { User } from 'src/users/entities/user.entity';
import { CreateAlertDto } from './dto/create-alert.dto';
import { UpdateAlertDto } from './dto/update-alert.dto';
import { AlertWidget } from './entities/alert-widget.entity';
import { QuerySoundDto } from './dto/query-sound.dto';

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

  async generateSound({ text, genderVoice, languageCode }: QuerySoundDto) {
    const lang = Object.values(languageCodes).find(
      ({ franc }) => franc === languageCode,
    );

    const request: googlePkg.google.cloud.texttospeech.v1.ISynthesizeSpeechRequest =
      {
        input: { text: text.replaceAll('*', '') },
        voice: {
          languageCode: 'en-US',
          ssmlGender: 'NEUTRAL',
        },
        audioConfig: { audioEncoding: 'MP3' },
      };

    if (lang) {
      const cyrillic = ['rus', 'bel'];
      const langConfig = cyrillic.includes(lang.franc)
        ? languageCodes.Russian
        : lang;

      request.voice = {
        ...request.voice,
        languageCode: langConfig.google,
      };

      let voiceName = null;
      Object.entries(languageVoices).forEach(([langCode, variants]) => {
        const findEl = variants.find(
          ({ ssmlGender }) =>
            langCode === langConfig.google && ssmlGender === genderVoice,
        );
        if (findEl) voiceName = findEl.voiceName;
      });

      if (voiceName) {
        request.voice = {
          ...request.voice,
          ssmlGender: genderVoice,
          name: voiceName,
        };
      }
    }

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

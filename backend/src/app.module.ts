import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';

import { staticFolder } from './common/const';
import { UsersModule } from './users/users.module';
import { NotificationsModule } from './notifications/notifications.module';
import { WidgetsModule } from './widgets/widgets.module';
import { FilesModule } from './files/files.module';
import { DonationsModule } from './donations/donations.module';
import { BadgesModule } from './badges/badges.module';
import { SocketsModule } from './sockets/sockets.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '../.env' }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', staticFolder),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('TYPEORM_HOST') || 'localhost',
        username: config.get<string>('TYPEORM_USERNAME'),
        password: config.get<string>('TYPEORM_PASSWORD'),
        database: config.get<string>('TYPEORM_DATABASE'),
        port: config.get<number>('TYPEORM_PORT'),
        // where are db entities stored
        entities: [__dirname + 'dist/**/*.entity.{ts,js}'],
        // so that the base changes, with changes in entities - without migrations
        synchronize: true,

        // Migrations
        // migrations: ['./migrations/*.ts'],
        // migrations: ['dist/migration/*{.ts,.js}'],
        // migrationsRun: false,
        // cli: {
        //   migrationsDir: 'src/migration',
        // },
        // migrationsTableName: 'migrations', // Specify this option only if you need migration table name to be different from "migrations"
        autoLoadEntities: true,
        logging: true,
      }),
    }),
    UsersModule,
    BadgesModule,
    DonationsModule,
    NotificationsModule,
    WidgetsModule,
    FilesModule,
    SocketsModule,
    AuthModule,
    MailModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

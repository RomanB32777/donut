import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FilesModule } from 'src/files/files.module';
import { User } from './entities/user.entity';
import { Creator } from './entities/creator.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AlertsModule } from 'src/widgets/alerts/alerts.module';

@Module({
  imports: [
    forwardRef(() => FilesModule),
    forwardRef(() => AlertsModule),
    TypeOrmModule.forFeature([User, Creator]),
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}

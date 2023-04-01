import { forwardRef, Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';

@Module({
  imports: [forwardRef(() => UsersModule)],
  providers: [FilesService],
  exports: [FilesService],
  controllers: [FilesController],
})
export class FilesModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { envValidation } from './config/env.validation';
import { CacheModule } from '@nestjs/cache-manager';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    CacheModule.register({}),
    ConfigModule.forRoot({
      envFilePath: ['.env.local', '.env'],
      isGlobal: true,
      expandVariables: true,
      validationSchema: envValidation,
    }),
    UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

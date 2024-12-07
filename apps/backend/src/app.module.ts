import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { envValidation } from './config/env.validation';
import { CacheModule } from '@nestjs/cache-manager';
import { UploadModule } from './upload/upload.module';
import { LoggerModule } from 'nestjs-pino';
import { clerkMiddleware } from '@clerk/express';
import { AiModule } from './ai/ai.module';
import { MetricsModule } from './metrics/metrics.module';

@Module({
  imports: [
    CacheModule.register({}),
    ConfigModule.forRoot({
      envFilePath: ['.env.local', '.env'],
      isGlobal: true,
      expandVariables: true,
      validationSchema: envValidation,
    }),
    LoggerModule.forRoot(),
    UploadModule,
    AiModule,
    MetricsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  constructor(private readonly configService: ConfigService) {}
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        clerkMiddleware({
          secretKey: this.configService.get('CLERK_SECRET_KEY'),
        }),
      )
      .forRoutes(
        {
          path: '/upload',
          method: RequestMethod.POST,
        },
        {
          path: '/ai/process',
          method: RequestMethod.POST,
        },
        {
          path: '/metrics',
          method: RequestMethod.POST,
        },
      );
  }
}

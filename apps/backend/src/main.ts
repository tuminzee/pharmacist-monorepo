import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { AppClusterService } from 'src/app-cluster.service';
import './tracing';

async function bootstrap() {
  try {
    const config = new ConfigService();
    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'log', 'debug', 'verbose', 'fatal'],
      cors: true,
      abortOnError: false,
      autoFlushLogs: true,
    });
    app.enableShutdownHooks();
    app.enableVersioning({
      defaultVersion: '1',
      type: VersioningType.URI,
      prefix: 'api/v',
    });

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
      }),
    );

    const swaggerConfig = new DocumentBuilder()
      .setTitle('Sanjivan API')
      .setDescription('API for Sanjivan')
      .setVersion('1.0')
      .addTag('sanjivan')
      .build();
    const documentFactory = () =>
      SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api', app, documentFactory);

    // Register graceful shutdown of OpenTelemetry
    app.enableShutdownHooks();

    await app.listen(config.get('PORT'));
  } catch (error) {
    console.error('Error during application bootstrap:', error);
    process.exit(1);
  }
}
AppClusterService.clusterize(bootstrap);

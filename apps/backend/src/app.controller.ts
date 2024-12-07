import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiProperty } from '@nestjs/swagger';
import { UploadService } from './upload/upload.service';

export class FileUploadDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: true,
    description: 'Image file (jpeg, png, gif, webp)',
  })
  file: Express.Multer.File;
}

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly uploadService: UploadService,
  ) {}

  @Get()
  getPing(): string {
    return this.appService.getPing();
  }
}

import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiBody, ApiProperty } from '@nestjs/swagger';
import { UploadService } from './upload/upload.service';
import { diskStorage } from 'multer';
import { AuthGuard } from './auth/auth.guard';

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

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: 'public/img',
        filename: (req, file, cb) => {
          cb(null, file.originalname);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowedMimeTypes = [
          'image/jpeg',
          'image/png',
          'image/gif',
          'image/webp',
        ];
        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

        if (!allowedMimeTypes.includes(file.mimetype)) {
          return cb(
            new HttpException(
              'Only image files (JPEG, PNG, GIF, WEBP) are allowed!',
              HttpStatus.BAD_REQUEST,
            ),
            false,
          );
        }

        const ext = file.originalname.toLowerCase().split('.').pop();
        if (!allowedExtensions.includes(`.${ext}`)) {
          return cb(
            new HttpException(
              'Invalid file extension!',
              HttpStatus.BAD_REQUEST,
            ),
            false,
          );
        }

        cb(null, true);
      },
    }),
  )
  @ApiBody({
    description: 'File to upload',
    type: FileUploadDto,
  })
  @ApiConsumes('multipart/form-data')
  @UseGuards(AuthGuard)
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.uploadService.uploadImage(file);
  }
}

import {
  Controller,
  HttpException,
  HttpStatus,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { FileUploadDto } from 'src/app.controller';
import { AuthGuard } from 'src/auth/auth.guard';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
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

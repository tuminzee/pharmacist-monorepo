import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs/promises';

import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);
  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadImage(file: Express.Multer.File): Promise<{
    url: string;
  }> {
    try {
      const result = await new Promise<UploadApiResponse>((resolve, reject) => {
        cloudinary.uploader.upload(file.path, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        });
      });

      await this.deleteLocalFile(file.path);
      return {
        url: result.url,
      };
    } catch (error) {
      await this.deleteLocalFile(file.path);
      throw error;
    }
  }

  private async deleteLocalFile(filePath: string): Promise<void> {
    try {
      await fs.unlink(filePath);
    } catch (error) {
      this.logger.error(`Failed to delete local file at ${filePath}:`, error);
    }
  }

  async deleteImage(publicId: string): Promise<any> {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result;
    } catch (error) {
      throw new Error(`Cloudinary delete failed: ${error.message}`);
    }
  }
}

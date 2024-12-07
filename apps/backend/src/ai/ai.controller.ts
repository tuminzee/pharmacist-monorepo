import { Body, Controller, Logger, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { AiService } from 'src/ai/ai.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('ai')
export class AiController {
  private readonly logger = new Logger(AiController.name);
  constructor(private readonly aiService: AiService) {}

  @Post('process')
  @ApiBody({
    description: 'The image URL to process',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'The image has been processed successfully',
  })
  @UseGuards(AuthGuard)
  processImage(@Body() body: { imageUrl: string }) {
    this.logger.log(`Processing image: ${body.imageUrl}`);
    return this.aiService.processImage(body.imageUrl);
  }
}

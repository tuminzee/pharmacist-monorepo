import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';

const PrescriptionSchema = z.object({
  medicines: z.array(
    z.object({
      name: z.string().describe('Name of the medicine'),
      dosage: z.string().describe('Dosage instructions'),
      duration: z.string().describe('Duration of the prescription'),
      timing: z.string().optional().describe('When to take the medicine'),
    }),
  ),
  doctorName: z.string().optional().describe('Name of the prescribing doctor'),
  date: z.string().optional().describe('Date of prescription'),
});

type PrescriptionType = z.infer<typeof PrescriptionSchema>;
@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPEN_API_KEY,
    });
  }

  async processImage(imageUrl: string): Promise<PrescriptionType> {
    this.logger.log(`Processing image: ${imageUrl}`);

    try {
      const completion = await this.openai.beta.chat.completions.parse({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              'Extract the prescription details in a structured format and return it in English. Ensure all medicine details are captured accurately.',
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Extract the following details from this prescription image: medicine names, dosage instructions, and duration. Format the response according to the specified JSON schema. Try to understand the context of the prescription and extract the details accordingly.',
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl,
                },
              },
            ],
          },
        ],
        max_tokens: 200,
        temperature: 0.5,
        response_format: zodResponseFormat(PrescriptionSchema, 'prescription'),
      });

      const result = completion.choices[0].message.content;
      const parsedResult = JSON.parse(result);
      this.logger.log(`Result: ${JSON.stringify(parsedResult)}`);
      return parsedResult;
    } catch (error) {
      this.logger.error('Error processing image:', error);
      throw error;
    }
  }
}

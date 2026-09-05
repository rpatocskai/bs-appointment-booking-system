import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class BarbersService {
  private readonly logger = new Logger(BarbersService.name);
  private readonly mockBarbers = [
    {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Kovács Péter',
      workSchedule: {
        monday: { start: '07:00', end: '15:00' },
        tuesday: { start: '07:00', end: '15:00' },
        wednesday: { start: '07:00', end: '15:00' },
        thursday: { start: '07:00', end: '15:00' },
        friday: { start: '07:00', end: '15:00' },
        saturday: { start: '08:00', end: '14:00' },
        sunday: { start: '00:00', end: '00:00' },
      },
    },
    {
      id: '987fcdeb-51a2-43d7-9012-34567890abcd',
      name: 'Nagy Gábor',
      workSchedule: {
        monday: { start: '12:00', end: '20:00' },
        tuesday: { start: '12:00', end: '20:00' },
        wednesday: { start: '12:00', end: '20:00' },
        thursday: { start: '12:00', end: '20:00' },
        friday: { start: '12:00', end: '20:00' },
        saturday: { start: '08:00', end: '14:00' },
        sunday: { start: '00:00', end: '00:00' },
      },
    },
  ];

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async getBarbers() {
    const baseUrl = this.configService.get<string>('BARBER_API_URL');
    const apiKey = this.configService.get<string>('BARBER_API_KEY')?.trim();

    try {
      const response = await firstValueFrom(
        this.httpService.get(`${baseUrl}/barbers`, {
          headers: {
            API_KEY: apiKey,
          },
        }),
      );
      return response.data;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';

      this.logger.warn(
        `Failed request to Barber API (${errorMessage}). Falling back to dummy data.`,
      );

      return this.mockBarbers;
    }
  }
}

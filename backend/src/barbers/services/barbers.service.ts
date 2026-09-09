import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { plainToInstance } from 'class-transformer';
import { BarberResponseDto } from '../dto/barber-response.dto.js';

@Injectable()
export class BarbersService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async getBarbers(): Promise<BarberResponseDto[]> {
    const baseUrl = this.configService.get<string>('BARBER_API_URL');
    const apiKey = this.configService.get<string>('BARBER_API_KEY')?.trim();

    try {
      const response = await firstValueFrom(
        this.httpService.get(`${baseUrl}/barbers`, {
          headers: {
            'x-api-key': apiKey,
          },
        }),
      );

      return plainToInstance(BarberResponseDto, response.data as object[]);
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed request to Barber API: ' +
          (error instanceof Error ? error.message : error),
      );
    }
  }
}

import { HttpService } from '@nestjs/axios';
import { InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AxiosResponse } from 'axios';
import { of, throwError } from 'rxjs';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { BarbersService } from './barbers.service.js';

describe('BarbersService', () => {
  let service: BarbersService;
  let httpService: HttpService;

  const mockConfigService = {
    get: vi.fn((key: string) => {
      if (key === 'BARBER_API_URL') return 'https://api.example.com';
      if (key === 'BARBER_API_KEY') return 'valid-test-key';
      return null;
    }),
  };

  const mockHttpService = {
    get: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BarbersService,
        { provide: ConfigService, useValue: mockConfigService },
        { provide: HttpService, useValue: mockHttpService },
      ],
    }).compile();

    service = module.get<BarbersService>(BarbersService);
    httpService = module.get<HttpService>(HttpService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('sikeresen visszaadja a borbélyok listáját', async () => {
    const mockBarbersData = [{ id: '1', name: 'Kovács Péter' }];
    const mockResponse: Partial<AxiosResponse> = {
      data: mockBarbersData,
      status: 200,
    };

    mockHttpService.get.mockReturnValue(of(mockResponse));

    const result = await service.getBarbers();

    expect(result).toEqual(mockBarbersData);
    expect(httpService.get).toHaveBeenCalledWith(
      'https://api.example.com/barbers',
      { headers: { 'x-api-key': 'valid-test-key' } },
    );
  });

  it('InternalServerErrorException-t dob hiba esetén', async () => {
    mockHttpService.get.mockReturnValue(
      throwError(() => new Error('Axios Error')),
    );

    await expect(service.getBarbers()).rejects.toThrow(
      InternalServerErrorException,
    );
  });
});

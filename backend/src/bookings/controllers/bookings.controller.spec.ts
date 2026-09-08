import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { vi, describe, beforeEach, it, expect } from 'vitest';
import { BookingsController } from './bookings.controller.js';
import { BookingsService } from '../services/bookings.service.js';

describe('BookingsController', () => {
  let controller: BookingsController;

  // Mock BookingsService and ConfigService
  const mockBookingsService = {};
  const mockConfigService = {
    get: vi.fn().mockReturnValue('teszt-api-kulcs'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookingsController],
      providers: [
        {
          provide: BookingsService,
          useValue: mockBookingsService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    controller = module.get<BookingsController>(BookingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

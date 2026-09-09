import { Test, TestingModule } from '@nestjs/testing';
import { BookingsController } from './bookings.controller.js';
import { BookingsService } from '../services/bookings.service.js';
import { ConfigService } from '@nestjs/config';

import { describe, beforeEach, it, expect, vi } from 'vitest';
import { AvailabilityDto } from '../dtos/availability.dto.js';
import { CreateBookingDto } from '../dtos/create-booking.dto.js';

describe('BookingsController (Unit)', () => {
  let controller: BookingsController;

  const mockBookingsService = {
    getAvailability: vi.fn(),
    createBooking: vi.fn(),
    getBookingsByEmail: vi.fn(),
    deleteBooking: vi.fn(),
    deleteAllBookings: vi.fn(),
  };

  const mockConfigService = {
    get: vi.fn().mockReturnValue('test-key'),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookingsController],
      providers: [
        { provide: BookingsService, useValue: mockBookingsService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    controller = module.get<BookingsController>(BookingsController);
  });

  it('getAvailability meg kell hívja a service-t', async () => {
    const dto: AvailabilityDto = { barberId: 'b1', date: '2026-09-09' };
    mockBookingsService.getAvailability.mockResolvedValue([]);

    const result = await controller.getAvailability(dto);
    expect(mockBookingsService.getAvailability).toHaveBeenCalledWith(dto);
    expect(result).toEqual([]);
  });

  it('createBooking meg kell hívja a service-t', async () => {
    const dto: CreateBookingDto = {
      barberId: 'b1',
      customerEmail: 't@t.hu',
      startTime: '2026-09-09T10:00:00Z',
      endTime: '2026-09-09T10:30:00Z',
    };
    mockBookingsService.createBooking.mockResolvedValue(dto);

    const result = await controller.createBooking(dto);
    expect(mockBookingsService.createBooking).toHaveBeenCalledWith(dto);
    expect(result).toEqual(dto);
  });

  it('getBookingsByEmail meg kell hívja a service-t', async () => {
    mockBookingsService.getBookingsByEmail.mockResolvedValue([]);

    const result = await controller.getBookingsByEmail('test@test.hu');
    expect(mockBookingsService.getBookingsByEmail).toHaveBeenCalledWith(
      'test@test.hu',
    );
    expect(result).toEqual([]);
  });

  it('deleteBooking meg kell hívja a service-t', async () => {
    mockBookingsService.deleteBooking.mockResolvedValue(undefined);

    await controller.deleteBooking('id-123');
    expect(mockBookingsService.deleteBooking).toHaveBeenCalledWith('id-123');
  });

  it('deleteAllBookings meg kell hívja a service-t', async () => {
    mockBookingsService.deleteAllBookings.mockResolvedValue(undefined);

    await controller.deleteAllBookings();
    expect(mockBookingsService.deleteAllBookings).toHaveBeenCalled();
  });
});

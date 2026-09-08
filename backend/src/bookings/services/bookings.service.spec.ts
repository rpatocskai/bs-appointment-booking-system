import { Test, TestingModule } from '@nestjs/testing';

import { BadRequestException, ConflictException } from '@nestjs/common';
import { beforeEach, describe, it, expect, vi, afterEach } from 'vitest';
import { BookingsService } from './bookings.service.js';
import { Booking } from '../domains/booking.entity.js';
import { CreateBookingDto } from '../dtos/create-booking.dto.js';
import { BusinessDayValidator } from '../validators/business-day.validator.js';
import { OpeningHoursValidator } from '../validators/opening-hours.validator.js';
import { OverlapValidator } from '../validators/overlap.validator.js';
import { PastDateValidator } from '../validators/past-date.validator.js';
import { TimeSlotGeneratorService } from './time-slot-generator.service.js';

describe('BookingsService', () => {
  let service: BookingsService;

  const mockBookingRepository = {
    findByBarberId: vi.fn(),
    save: vi.fn(),
    deleteAll: vi.fn(),
  };

  const mockBusinessDayValidator = { validate: vi.fn() };
  const mockOpeningHoursValidator = { validate: vi.fn() };
  const mockPastDateValidator = { validate: vi.fn() };
  const mockOverlapValidator = { validateNoOverlap: vi.fn() };

  beforeEach(async () => {
    vi.mocked(mockBookingRepository.findByBarberId).mockReset();
    vi.mocked(mockBookingRepository.save).mockReset();
    vi.mocked(mockBusinessDayValidator.validate).mockReset();
    vi.mocked(mockOpeningHoursValidator.validate).mockReset();
    vi.mocked(mockPastDateValidator.validate).mockReset();
    vi.mocked(mockOverlapValidator.validateNoOverlap).mockReset();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        TimeSlotGeneratorService,
        { provide: 'IBookingRepository', useValue: mockBookingRepository },
        { provide: BusinessDayValidator, useValue: mockBusinessDayValidator },
        { provide: OpeningHoursValidator, useValue: mockOpeningHoursValidator },
        { provide: PastDateValidator, useValue: mockPastDateValidator },
        { provide: OverlapValidator, useValue: mockOverlapValidator },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);

    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-09-08T12:00:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('getAvailability', () => {
    const availabilityDto = {
      barberId: 'barber-1',
      date: '2026-09-08',
    };

    it('vissza kell adnia a szabad időpontokat, kiszűrve a múltbelieket és a foglaltakat', async () => {
      const mockSlots = [
        {
          startTime: new Date('2026-09-08T11:00:00.000Z'),
          endTime: new Date('2026-09-08T11:30:00.000Z'),
        },
        {
          startTime: new Date('2026-09-08T14:00:00.000Z'),
          endTime: new Date('2026-09-08T14:30:00.000Z'),
        },
        {
          startTime: new Date('2026-09-08T15:00:00.000Z'),
          endTime: new Date('2026-09-08T15:30:00.000Z'),
        },
      ];

      vi.spyOn(
        service['timeSlotGenerator'],
        'generateSlotsForDate',
      ).mockReturnValue(mockSlots);

      const existingBooking = new Booking({
        startTime: new Date('2026-09-08T15:00:00.000Z'),
        endTime: new Date('2026-09-08T15:30:00.000Z'),
      });

      vi.spyOn(existingBooking, 'overlapsWith').mockImplementation(
        (start) => start.toISOString() === '2026-09-08T15:00:00.000Z',
      );

      mockBookingRepository.findByBarberId.mockResolvedValue([existingBooking]);

      const result = await service.getAvailability(availabilityDto);

      expect(result.length).toBe(1);
      expect(result[0].startTime.toISOString()).toBe(
        '2026-09-08T14:00:00.000Z',
      );

      expect(mockBusinessDayValidator.validate).toHaveBeenCalledWith(
        expect.any(Date),
      );
      expect(mockBookingRepository.findByBarberId).toHaveBeenCalledWith(
        availabilityDto.barberId,
      );
    });
  });

  describe('createBooking', () => {
    const createDto: CreateBookingDto = {
      barberId: 'barber-1',
      customerEmail: 'teszt@email.hu',
      startTime: '2026-09-08T14:00:00.000Z',
      endTime: '2026-09-08T14:30:00.000Z',
    };

    it('sikeresen létre kell hoznia és mentenie kell egy foglalást, ha minden validáció sikeres', async () => {
      mockBookingRepository.findByBarberId.mockResolvedValue([]);
      mockBookingRepository.save.mockImplementation((booking: Booking) =>
        Promise.resolve(booking),
      );

      const result = await service.createBooking(createDto);

      expect(mockPastDateValidator.validate).toHaveBeenCalled();
      expect(mockBusinessDayValidator.validate).toHaveBeenCalled();
      expect(mockOpeningHoursValidator.validate).toHaveBeenCalled();
      expect(mockOverlapValidator.validateNoOverlap).toHaveBeenCalled();

      expect(result.barberId).toBe(createDto.barberId);
      expect(result.customerEmail).toBe(createDto.customerEmail);
      expect(result.id).toBeDefined();
      expect(mockBookingRepository.save).toHaveBeenCalledWith(
        expect.any(Booking),
      );
    });

    it('továbbítania kell a PastDateValidator által dobott kivételt', async () => {
      mockPastDateValidator.validate.mockImplementation(() => {
        throw new BadRequestException('Múltbeli időpont');
      });

      await expect(service.createBooking(createDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockBookingRepository.save).not.toHaveBeenCalled();
    });

    it('továbbítania kell az OverlapValidator által dobott kivételt', async () => {
      mockBookingRepository.findByBarberId.mockResolvedValue([]);
      mockPastDateValidator.validate.mockImplementation(() => {});
      mockOverlapValidator.validateNoOverlap.mockImplementation(() => {
        throw new ConflictException('Átfedő időpont');
      });

      await expect(service.createBooking(createDto)).rejects.toThrow(
        ConflictException,
      );
      expect(mockBookingRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('deleteAllBookings', () => {
    it('meg kell hívnia a repository deleteAll metódusát', async () => {
      mockBookingRepository.deleteAll.mockResolvedValue(undefined);

      await service.deleteAllBookings();

      expect(mockBookingRepository.deleteAll).toHaveBeenCalled();
    });
  });
});

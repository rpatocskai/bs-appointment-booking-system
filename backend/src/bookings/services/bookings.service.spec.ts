import { Test, TestingModule } from '@nestjs/testing';

import { AvailabilityDto } from '../dtos/availability.dto.js';
import { Booking } from '../domains/booking.entity.js';
import { OverlapValidator } from '../validators/overlap.validator.js';
import { BusinessDayValidator } from '../validators/business-day.validator.js';
import { OpeningHoursValidator } from '../validators/opening-hours.validator.js';
import { PastDateValidator } from '../validators/past-date.validator.js';
import { BookingsService } from './bookings.service.js';
import { TimeSlotGeneratorService } from './time-slot-generator.service.js';
import { BadRequestException } from '@nestjs/common';
let service: BookingsService;

const mockBookingRepository = {
  findByBarberId: vi.fn(),
};

beforeEach(async () => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      BookingsService,
      TimeSlotGeneratorService,
      BusinessDayValidator,
      OpeningHoursValidator,
      PastDateValidator,
      OverlapValidator,
      {
        provide: 'IBookingRepository',
        useValue: mockBookingRepository,
      },
    ],
  }).compile();

  service = module.get<BookingsService>(BookingsService);

  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-09-08T12:00:00.000Z'));
});

afterEach(() => {
  vi.useRealTimers();
});

it('vissza kell adnia a szabad időpontokat, kiszűrve a múltbelieket és a meglévő foglalásokat', async () => {
  const barberId = 'barber-123';
  const dto: AvailabilityDto = { barberId, date: '2026-09-08' };

  const existingBooking = new Booking({
    id: 'b1',
    barberId,
    customerEmail: 'teszt@email.hu',
    startTime: new Date('2026-09-08T14:00:00.000Z'),
    endTime: new Date('2026-09-08T14:30:00.000Z'),
  });

  mockBookingRepository.findByBarberId.mockResolvedValue([existingBooking]);

  const availableSlots = await service.getAvailability(dto);

  const hasBookedSlot = availableSlots.some(
    (slot) => slot.startTime.toISOString() === '2026-09-08T14:00:00.000Z',
  );
  expect(hasBookedSlot).toBe(false);

  const hasPastSlot = availableSlots.some(
    (slot) => slot.startTime < new Date('2026-09-08T12:00:00.000Z'),
  );
  expect(hasPastSlot).toBe(false);

  const hasValidFutureSlot = availableSlots.some(
    (slot) => slot.startTime.toISOString() === '2026-09-08T15:00:00.000Z',
  );
  expect(hasValidFutureSlot).toBe(true);
});

it('BadRequestException-t kell továbbítania, ha zárva tartó napra kérdezik le az elérhetőséget', async () => {
  const dto: AvailabilityDto = { barberId: 'barber-123', date: '2026-09-13' };

  await expect(service.getAvailability(dto)).rejects.toThrow(
    BadRequestException,
  );
});

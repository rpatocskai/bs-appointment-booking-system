import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import * as bookingRepositoryInterface from '../domains/booking.repository.interface.js';
import { BusinessDayValidator } from '../validators/business-day.validator.js';
import { OpeningHoursValidator } from '../validators/opening-hours.validator.js';
import { PastDateValidator } from '../validators/past-date.validator.js';
import {
  TimeSlot,
  TimeSlotGeneratorService,
} from './time-slot-generator.service.js';
import { OverlapValidator } from '../validators/overlap.validator.js';
import { AvailabilityDto } from '../dtos/availability.dto.js';
import { Booking } from '../domains/booking.entity.js';
import { randomUUID } from 'crypto';
import { CreateBookingDto } from '../dtos/create-booking.dto.js';

@Injectable()
export class BookingsService {
  constructor(
    @Inject('IBookingRepository')
    private readonly bookingRepository: bookingRepositoryInterface.IBookingRepository,
    private readonly openingHoursValidator: OpeningHoursValidator,
    private readonly businessDayValidator: BusinessDayValidator,
    private readonly pastDateValidator: PastDateValidator,
    private readonly timeSlotGenerator: TimeSlotGeneratorService,
    private readonly overlapValidator: OverlapValidator,
  ) {}

  async validateBookingTimes(
    startTimeStr: string,
    endTimeStr: string,
  ): Promise<void> {
    const start = new Date(startTimeStr);
    const end = new Date(endTimeStr);

    this.pastDateValidator.validate(start);
    this.businessDayValidator.validate(start);
    this.openingHoursValidator.validate(start, end);
  }

  async checkOverlap(
    barberId: string,
    startTime: Date,
    endTime: Date,
  ): Promise<void> {
    const barberBookings =
      await this.bookingRepository.findByBarberId(barberId);

    this.overlapValidator.validateNoOverlap(startTime, endTime, barberBookings);
  }

  generateDailySlots(dateStr: string): TimeSlot[] {
    return this.timeSlotGenerator.generateSlotsForDate(dateStr);
  }

  async getAvailability(dto: AvailabilityDto): Promise<TimeSlot[]> {
    const targetDate = new Date(dto.date);

    this.businessDayValidator.validate(targetDate);

    const allSlots = this.timeSlotGenerator.generateSlotsForDate(dto.date);
    const barberBookings = await this.bookingRepository.findByBarberId(
      dto.barberId,
    );

    const now = new Date();

    return allSlots.filter((slot) => {
      if (slot.startTime < now) {
        return false;
      }

      const isOverlapping = barberBookings.some((booking) =>
        booking.overlapsWith(slot.startTime, slot.endTime),
      );

      return !isOverlapping;
    });
  }

  async createBooking(dto: CreateBookingDto): Promise<Booking> {
    const start = new Date(dto.startTime);
    const end = new Date(dto.endTime);

    this.pastDateValidator.validate(start);

    this.businessDayValidator.validate(start);

    this.openingHoursValidator.validate(start, end);

    const barberBookings = await this.bookingRepository.findByBarberId(
      dto.barberId,
    );
    this.overlapValidator.validateNoOverlap(start, end, barberBookings);

    const newBooking = new Booking({
      id: randomUUID(),
      barberId: dto.barberId,
      customerEmail: dto.customerEmail,
      startTime: start,
      endTime: end,
      createdAt: new Date(),
    });

    return this.bookingRepository.save(newBooking);
  }

  async getBookingsByEmail(email: string): Promise<Booking[]> {
    if (!email) {
      throw new BadRequestException('Az e-mail cím megadása kötelező');
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new BadRequestException('Érvénytelen e-mail cím formátum');
    }

    return this.bookingRepository.findByEmail(email);
  }

  async deleteBooking(id: string): Promise<void> {
    const isDeleted = await this.bookingRepository.delete(id);
    if (!isDeleted) {
      throw new NotFoundException(
        `A megadott azonosítóval (${id}) nem található foglalás`,
      );
    }
  }

  async deleteAllBookings(): Promise<void> {
    await this.bookingRepository.deleteAll();
  }
}

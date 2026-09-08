import { Injectable, Inject } from '@nestjs/common';
import * as bookingRepositoryInterface from '../domains/booking.repository.interface.js';
import { BusinessDayValidator } from '../validators/business-day.validator.js';
import { OpeningHoursValidator } from '../validators/opening-hours.validator.js';
import { PastDateValidator } from '../validators/past-date.validator.js';

@Injectable()
export class BookingsService {
  constructor(
    @Inject('IBookingRepository')
    private readonly bookingRepository: bookingRepositoryInterface.IBookingRepository,
    private readonly openingHoursValidator: OpeningHoursValidator,
    private readonly businessDayValidator: BusinessDayValidator,
    private readonly pastDateValidator: PastDateValidator,
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
}

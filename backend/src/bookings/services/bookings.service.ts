import { Injectable, Inject } from '@nestjs/common';
import * as bookingRepositoryInterface from '../domains/booking.repository.interface.js';
import { OpeningHoursValidator } from '../validators/opening-hours.validator.js';

@Injectable()
export class BookingsService {
  constructor(
    @Inject('IBookingRepository')
    private readonly bookingRepository: bookingRepositoryInterface.IBookingRepository,
    private readonly openingHoursValidator: OpeningHoursValidator,
  ) {}

  async validateBookingTimes(
    startTimeStr: string,
    endTimeStr: string,
  ): Promise<void> {
    const start = new Date(startTimeStr);
    const end = new Date(endTimeStr);

    this.openingHoursValidator.validate(start, end);
  }
}

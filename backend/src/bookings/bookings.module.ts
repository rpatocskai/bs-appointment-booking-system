import { Module } from '@nestjs/common';
import { BookingsController } from './controllers/bookings.controller.js';
import { BookingsService } from './services/bookings.service.js';
import { JsonBookingRepository } from './infrastructure/json-booking-repository.js';
import { OpeningHoursValidator } from './validators/opening-hours.validator.js';
import { BusinessDayValidator } from './validators/business-day.validator.js';
import { PastDateValidator } from './validators/past-date.validator.js';
import { TimeSlotGeneratorService } from './services/time-slot-generator.service.js';

@Module({
  controllers: [BookingsController],
  providers: [
    BookingsService,
    TimeSlotGeneratorService,
    OpeningHoursValidator,
    BusinessDayValidator,
    PastDateValidator,
    { provide: 'IBookingRepository', useClass: JsonBookingRepository },
  ],
  exports: [BookingsService],
})
export class BookingsModule {}

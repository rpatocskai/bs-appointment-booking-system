import { Module } from '@nestjs/common';
import { BookingsController } from './controllers/bookings.controller.js';
import { BookingsService } from './services/bookings.service.js';
import { JsonBookingRepository } from './infrastructure/json-booking-repository.js';

@Module({
  controllers: [BookingsController],
  providers: [
    BookingsService,
    { provide: 'IBookingRepository', useClass: JsonBookingRepository },
  ],
  exports: [BookingsService, 'IBookingRepository'],
})
export class BookingsModule {}

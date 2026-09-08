import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { BookingsService } from '../services/bookings.service.js';
import { AvailabilityDto } from '../dtos/availability.dto.js';
import { ApiKeyGuard } from '../../common/guards/api-key.guard.js';
import { CreateBookingDto } from '../dtos/create-booking.dto.js';

@Controller('bookings')
@UseGuards(ApiKeyGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get('availability')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async getAvailability(@Query() query: AvailabilityDto) {
    return this.bookingsService.getAvailability(query);
  }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async createBooking(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.createBooking(createBookingDto);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAllBookings() {
    await this.bookingsService.deleteAllBookings();
  }
}

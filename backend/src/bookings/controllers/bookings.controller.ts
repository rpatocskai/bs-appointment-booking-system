import {
  Controller,
  Get,
  Post,
  Delete,
  Query,
  Param,
  Body,
  UsePipes,
  ValidationPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { BookingsService } from '../services/bookings.service.js';
import { AvailabilityDto } from '../dtos/availability.dto.js';
import { CreateBookingDto } from '../dtos/create-booking.dto.js';

@Controller('bookings')
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

  @Get()
  async getBookingsByEmail(@Query('email') email: string) {
    return this.bookingsService.getBookingsByEmail(email);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBooking(@Param('id') id: string) {
    await this.bookingsService.deleteBooking(id);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAllBookings() {
    await this.bookingsService.deleteAllBookings();
  }
}

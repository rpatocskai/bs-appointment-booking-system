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
  UseGuards,
} from '@nestjs/common';
import { BookingsService } from '../services/bookings.service.js';
import { AvailabilityDto } from '../dtos/availability.dto.js';
import { CreateBookingDto } from '../dtos/create-booking.dto.js';
import { ApiKeyGuard } from '../../common/guards/api-key.guard.js';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';

@ApiTags('Bookings')
@ApiSecurity('x-api-key')
@Controller('bookings')
@UseGuards(ApiKeyGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get('availability')
  @ApiOperation({
    summary: 'Szabad idősávok lekérése adott napra és borbélyra',
  })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async getAvailability(@Query() query: AvailabilityDto) {
    return this.bookingsService.getAvailability(query);
  }

  @Post()
  @ApiOperation({
    summary: 'Új időpontfoglalás létrehozása üzleti validációkkal',
  })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async createBooking(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.createBooking(createBookingDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Egy vendég összes saját foglalásának lekérése e-mail cím alapján',
  })
  async getBookingsByEmail(@Query('email') email: string) {
    return this.bookingsService.getBookingsByEmail(email);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Egy konkrét foglalás lemondása azonosító alapján' })
  async deleteBooking(@Param('id') id: string) {
    await this.bookingsService.deleteBooking(id);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Hard Reset - Összes létező foglalás törlése a rendszerből',
  })
  async deleteAllBookings() {
    await this.bookingsService.deleteAllBookings();
  }
}

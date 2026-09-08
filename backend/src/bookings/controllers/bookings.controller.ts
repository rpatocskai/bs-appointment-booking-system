import {
  Controller,
  Get,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { BookingsService } from '../services/bookings.service.js';
import { AvailabilityDto } from '../dtos/availability.dto.js';
import { ApiKeyGuard } from '../../common/guards/api-key.guard.js';

@Controller('bookings')
@UseGuards(ApiKeyGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get('availability')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async getAvailability(@Query() query: AvailabilityDto) {
    return this.bookingsService.getAvailability(query);
  }
}

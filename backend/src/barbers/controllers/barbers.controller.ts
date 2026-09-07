import { Controller, Get, UseGuards } from '@nestjs/common';
import { BarbersService } from '../services/barbers.service.js';
import { ApiKeyGuard } from '../../common/guards/api-key.guard.js';

@Controller('barbers')
@UseGuards(ApiKeyGuard)
export class BarbersController {
  constructor(private readonly barbersService: BarbersService) {}

  @Get()
  async findAll() {
    return this.barbersService.getBarbers();
  }
}

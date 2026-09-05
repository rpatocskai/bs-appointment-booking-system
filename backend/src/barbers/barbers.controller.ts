import { Controller, Get } from '@nestjs/common';
import { BarbersService } from './barbers.service.js';

@Controller('barbers')
export class BarbersController {
  constructor(private readonly barbersService: BarbersService) {}

  @Get()
  async findAll() {
    return this.barbersService.getBarbers();
  }
}

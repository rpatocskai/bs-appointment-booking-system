import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiSecurity,
  ApiResponse,
} from '@nestjs/swagger';
import { BarbersService } from '../services/barbers.service.js';
import { ApiKeyGuard } from '../../common/guards/api-key.guard.js';
import { BarberResponseDto } from '../dto/barber-response.dto.js';

@ApiTags('Barbers')
@ApiSecurity('x-api-key')
@Controller('barbers')
@UseGuards(ApiKeyGuard)
export class BarbersController {
  constructor(private readonly barbersService: BarbersService) {}

  @Get()
  @ApiOperation({
    summary:
      'Az összes elérhető mesterborbély és heti beosztásuk listázása a külső API-ból',
  })
  @ApiResponse({
    status: 200,
    description: 'A borbélyok listája sikeresen lekérve és validálva.',
    type: BarberResponseDto,
    isArray: true,
  })
  async findAll(): Promise<BarberResponseDto[]> {
    return this.barbersService.getBarbers();
  }
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class WorkScheduleDayDto {
  @ApiProperty({
    description: 'A munkaidő kezdete (helyi idő)',
    example: '07:00',
  })
  start: string;

  @ApiProperty({ description: 'A munkaidő vége (helyi idő)', example: '20:00' })
  end: string;
}

export class WorkScheduleDto {
  @ApiPropertyOptional({ type: WorkScheduleDayDto })
  monday?: WorkScheduleDayDto;

  @ApiPropertyOptional({ type: WorkScheduleDayDto })
  tuesday?: WorkScheduleDayDto;

  @ApiPropertyOptional({ type: WorkScheduleDayDto })
  wednesday?: WorkScheduleDayDto;

  @ApiPropertyOptional({ type: WorkScheduleDayDto })
  thursday?: WorkScheduleDayDto;

  @ApiPropertyOptional({ type: WorkScheduleDayDto })
  friday?: WorkScheduleDayDto;

  @ApiPropertyOptional({ type: WorkScheduleDayDto })
  saturday?: WorkScheduleDayDto;

  @ApiPropertyOptional({ type: WorkScheduleDayDto })
  sunday?: WorkScheduleDayDto;
}

export class BarberResponseDto {
  @ApiProperty({
    description: 'A borbély egyedi azonosítója',
    example: 'barber-1',
  })
  id: string;

  @ApiProperty({
    description: 'A borbély teljes neve',
    example: 'Gedeon Bácsi',
  })
  name: string;

  @ApiProperty({
    type: WorkScheduleDto,
    description: 'A borbély heti munkaidő beosztása',
  })
  workSchedule: WorkScheduleDto;
}

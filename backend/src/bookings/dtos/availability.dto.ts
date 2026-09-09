import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsDateString } from 'class-validator';

export class AvailabilityDto {
  @ApiProperty({
    description: 'A borbély egyedi azonosítója',
    example: 'barber-123',
  })
  @IsString()
  @IsNotEmpty({ message: 'A borbély azonosító megadása kötelező' })
  barberId: string;

  @ApiProperty({
    description: 'A vizsgált nap tiszta dátum formátumban (YYYY-MM-DD)',
    example: '2026-09-08',
  })
  @IsDateString(
    {},
    {
      message: 'A dátumnak érvényes ISO formátumúnak kell lennie (YYYY-MM-DD)',
    },
  )
  @IsNotEmpty({ message: 'A dátum megadása kötelező' })
  date: string;
}

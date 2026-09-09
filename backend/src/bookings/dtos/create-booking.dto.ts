import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsDateString } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({
    description: 'A választott borbély egyedi azonosítója',
    example: 'barber-123',
  })
  @IsString({
    message: 'A borbély azonosítójának szöveges formátumúnak kell lennie',
  })
  @IsNotEmpty({ message: 'A borbély kiválasztása kötelező' })
  barberId: string;

  @ApiProperty({
    description: 'A vendég e-mail címe a visszaigazoláshoz',
    example: 'vendegh@email.hu',
  })
  @IsEmail({}, { message: 'Érvénytelen e-mail cím formátum' })
  @IsNotEmpty({ message: 'Az e-mail cím megadása kötelező' })
  customerEmail: string;

  @ApiProperty({
    description: 'A foglalás kezdő időpontja ISO 8601 formátumban',
    example: '2026-09-08T14:00:00.000Z',
  })
  @IsDateString(
    {},
    {
      message:
        'A kezdő időpontnak érvényes ISO dátumnak kell lennie (pl. 2026-09-08T10:00:00.000Z)',
    },
  )
  @IsNotEmpty({ message: 'A kezdő időpont megadása kötelező' })
  startTime: string;

  @ApiProperty({
    description: 'A foglalás befejező időpontja ISO 8601 formátumban',
    example: '2026-09-08T14:30:00.000Z',
  })
  @IsDateString(
    {},
    {
      message:
        'A befejező időpontnak érvényes ISO dátumnak kell lennie (pl. 2026-09-08T10:30:00.000Z)',
    },
  )
  @IsNotEmpty({ message: 'A befejező időpont megadása kötelező' })
  endTime: string;
}

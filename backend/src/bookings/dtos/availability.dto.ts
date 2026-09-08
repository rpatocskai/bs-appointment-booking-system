import { IsNotEmpty, IsString, IsDateString } from 'class-validator';

export class AvailabilityDto {
  @IsString()
  @IsNotEmpty({ message: 'A borbély azonosító megadása kötelező' })
  barberId: string;

  @IsDateString(
    {},
    {
      message: 'A dátumnak érvényes ISO formátumúnak kell lennie (YYYY-MM-DD)',
    },
  )
  @IsNotEmpty({ message: 'A dátum megadása kötelező' })
  date: string;
}

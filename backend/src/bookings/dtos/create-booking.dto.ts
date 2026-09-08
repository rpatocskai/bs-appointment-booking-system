import { IsEmail, IsNotEmpty, IsString, IsDateString } from 'class-validator';

export class CreateBookingDto {
  @IsString({
    message: 'A borbély azonosítójának szöveges formátumúnak kell lennie',
  })
  @IsNotEmpty({ message: 'A borbély kiválasztása kötelező' })
  barberId: string;

  @IsEmail({}, { message: 'Érvénytelen e-mail cím formátum' })
  @IsNotEmpty({ message: 'Az e-mail cím megadása kötelező' })
  customerEmail: string;

  @IsDateString(
    {},
    {
      message:
        'A kezdő időpontnak érvényes ISO dátumnak kell lennie (pl. 2026-09-08T10:00:00.000Z)',
    },
  )
  @IsNotEmpty({ message: 'A kezdő időpont megadása kötelező' })
  startTime: string;

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

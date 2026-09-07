import { IsEmail, IsNotEmpty, IsString, IsDateString } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
  barberId: string;

  @IsEmail({}, { message: 'Érvénytelen e-mail cím formátum' })
  @IsNotEmpty()
  customerEmail: string;

  @IsDateString(
    {},
    { message: 'A kezdő időpontnak érvényes ISO dátumnak kell lennie' },
  )
  @IsNotEmpty()
  startTime: string;

  @IsDateString(
    {},
    { message: 'A befejező időpontnak érvényes ISO dátumnak kell lennie' },
  )
  @IsNotEmpty()
  endTime: string;
}

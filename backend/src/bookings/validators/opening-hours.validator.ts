import { Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class OpeningHoursValidator {
  private readonly OPENING_HOUR = 7;
  private readonly CLOSING_HOUR = 20;

  validate(startTime: Date, endTime: Date): void {
    const startParts = this.getBudapestTimeParts(startTime);
    const endParts = this.getBudapestTimeParts(endTime);

    if (startParts.hour < this.OPENING_HOUR) {
      throw new BadRequestException(
        'A foglalás nem kezdődhet a nyitvatartási idő előtt (07:00)',
      );
    }

    if (
      endParts.hour > this.CLOSING_HOUR ||
      (endParts.hour === this.CLOSING_HOUR && endParts.minute > 0)
    ) {
      throw new BadRequestException(
        'A foglalás nem fejeződhet be a záróra után (20:00)',
      );
    }

    if (startTime >= endTime) {
      throw new BadRequestException(
        'A kezdési időpontnak korábbinak kell lennie, mint a befejező időpont',
      );
    }
  }

  // Helper function
  private getBudapestTimeParts(date: Date): { hour: number; minute: number } {
    const formatter = new Intl.DateTimeFormat('hu-HU', {
      timeZone: 'Europe/Budapest',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    const parts = formatter.formatToParts(date);
    const hour = parseInt(
      parts.find((p) => p.type === 'hour')?.value || '0',
      10,
    );
    const minute = parseInt(
      parts.find((p) => p.type === 'minute')?.value || '0',
      10,
    );

    return { hour, minute };
  }
}

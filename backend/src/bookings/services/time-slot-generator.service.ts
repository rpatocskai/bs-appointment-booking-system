import { Injectable } from '@nestjs/common';

export interface TimeSlot {
  startTime: Date;
  endTime: Date;
}

@Injectable()
export class TimeSlotGeneratorService {
  private readonly OPENING_HOUR = 7; // 07:00
  private readonly CLOSING_HOUR = 20; // 20:00
  private readonly SLOT_DURATION_MINUTES = 30;

  generateSlotsForDate(dateStr: string): TimeSlot[] {
    const slots: TimeSlot[] = [];

    // Format has to be YYYY-MM-DD (example: '2026-09-07')
    const cleanDateStr = dateStr.split('T')[0];

    const startOfDay = this.createBudapestDate(
      cleanDateStr,
      this.OPENING_HOUR,
      0,
    );
    const endOfDay = this.createBudapestDate(
      cleanDateStr,
      this.CLOSING_HOUR,
      0,
    );

    let currentStart = new Date(startOfDay);

    while (currentStart < endOfDay) {
      const currentEnd = new Date(
        currentStart.getTime() + this.SLOT_DURATION_MINUTES * 60 * 1000,
      );

      if (currentEnd <= endOfDay) {
        slots.push({
          startTime: new Date(currentStart),
          endTime: new Date(currentEnd),
        });
      }

      currentStart = currentEnd;
    }

    return slots;
  }

  private createBudapestDate(
    dateStr: string,
    hour: number,
    minute: number,
  ): Date {
    const pad = (num: number) => String(num).padStart(2, '0');
    const isoStringWithoutZone = `${dateStr}T${pad(hour)}:${pad(minute)}:00`;
    const targetDate = new Date(`${isoStringWithoutZone}Z`);
    const tzOffset = this.getBudapestOffset(targetDate);

    return new Date(targetDate.getTime() - tzOffset);
  }

  private getBudapestOffset(date: Date): number {
    const tzString = date.toLocaleString('en-US', {
      timeZone: 'Europe/Budapest',
    });
    const localDate = new Date(tzString);
    return localDate.getTime() - date.getTime();
  }
}

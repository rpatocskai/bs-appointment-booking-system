// src/bookings/services/time-slot-generator.service.ts
import { Injectable } from '@nestjs/common';

export interface TimeSlot {
  startTime: Date;
  endTime: Date;
}

@Injectable()
export class TimeSlotGeneratorService {
  private readonly OPENING_HOUR = 7;
  private readonly CLOSING_HOUR = 20;
  private readonly SLOT_DURATION_MINUTES = 30;

  generateSlotsForDate(dateStr: string): TimeSlot[] {
    const slots: TimeSlot[] = [];
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
    const localIso = `${dateStr}T${pad(hour)}:${pad(minute)}:00`;
    const targetDate = new Date(`${localIso}Z`);

    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Europe/Budapest',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false,
    });

    const gmtParts = formatter.formatToParts(targetDate);
    const gmtHour = parseInt(
      gmtParts.find((p) => p.type === 'hour')?.value || '0',
      10,
    );

    let offset = gmtHour - hour;
    if (offset < -12) offset += 24;
    if (offset > 12) offset -= 24;

    return new Date(targetDate.getTime() - offset * 60 * 60 * 1000);
  }
}

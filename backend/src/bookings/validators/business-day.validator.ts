import { Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class BusinessDayValidator {
  // In production use live API
  private readonly HOLIDAYS: string[] = [
    '2026-01-01', // Újév
    '2026-03-15', // Nemzeti ünnep
    '2026-04-03', // Nagypéntek
    '2026-04-06', // Húsvéthétfő
    '2026-05-01', // A munka ünnepe
    '2026-05-25', // Pünkösdhétfő
    '2026-08-20', // Államalapítás ünnepe
    '2026-10-23', // 1956-os forradalom
    '2026-11-01', // Mindenszentek
    '2026-12-25', // Karácsony
    '2026-12-26', // Karácsony
  ];

  validate(date: Date): void {
    const { dayOfWeek, formattedDate } = this.getBudapestDateDetails(date);

    // Check Sunday
    if (dayOfWeek === 0) {
      throw new BadRequestException('A szalon vasárnap zárva tart');
    }

    // Check holidays
    if (this.HOLIDAYS.includes(formattedDate)) {
      throw new BadRequestException('A szalon munkaszüneti napokon zárva tart');
    }
  }

  private getBudapestDateDetails(date: Date): {
    dayOfWeek: number;
    formattedDate: string;
  } {
    // Create string form Budapest time
    const tzString = date.toLocaleString('en-US', {
      timeZone: 'Europe/Budapest',
    });
    const localDate = new Date(tzString);
    const dayOfWeek = localDate.getDay();

    const year = localDate.getFullYear();
    const month = String(localDate.getMonth() + 1).padStart(2, '0');
    const day = String(localDate.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    return { dayOfWeek, formattedDate };
  }
}

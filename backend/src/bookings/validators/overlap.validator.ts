import { Injectable, ConflictException } from '@nestjs/common';
import { Booking } from '../domains/booking.entity.js';

@Injectable()
export class OverlapValidator {
  validateNoOverlap(
    newStart: Date,
    newEnd: Date,
    existingBookings: Booking[],
  ): void {
    // Invite overlaps method
    const hasOverlap = existingBookings.some((booking) =>
      booking.overlapsWith(newStart, newEnd),
    );

    if (hasOverlap) {
      throw new ConflictException(
        'A kiválasztott borbélynak már van foglalása ebben az időintervallumban',
      );
    }
  }
}

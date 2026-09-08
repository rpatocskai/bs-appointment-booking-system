import { ConflictException } from '@nestjs/common';
import { describe, beforeEach, it, expect } from 'vitest';
import { Booking } from '../domains/booking.entity.js';
import { OverlapValidator } from './overlap.validator.js';

describe('OverlapValidator', () => {
  let validator: OverlapValidator;

  beforeEach(() => {
    validator = new OverlapValidator();
  });

  it('ConflictException-t kell dobnia, ha az új időpont ütközik egy már meglévő foglalással', () => {
    const existing = new Booking({
      startTime: new Date('2026-09-08T10:00:00.000Z'),
      endTime: new Date('2026-09-08T10:30:00.000Z'),
    });

    const newStart = new Date('2026-09-08T10:15:00.000Z');
    const newEnd = new Date('2026-09-08T10:45:00.000Z');

    expect(() =>
      validator.validateNoOverlap(newStart, newEnd, [existing]),
    ).toThrow(ConflictException);
  });
});

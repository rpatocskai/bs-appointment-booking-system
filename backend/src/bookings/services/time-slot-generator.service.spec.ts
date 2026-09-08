import { describe, beforeEach, it, expect } from 'vitest';
import { TimeSlotGeneratorService } from './time-slot-generator.service.js';

describe('TimeSlotGeneratorService', () => {
  let service: TimeSlotGeneratorService;

  beforeEach(() => {
    service = new TimeSlotGeneratorService();
  });

  it('le kell gyártania az összes 30 perces idősávot a megadott napra a nyitvatartás szerint', () => {
    const slots = service.generateSlotsForDate('2026-09-08');

    expect(slots.length).toBe(26);
    expect(slots[0].startTime.toISOString()).toContain('T05:00:00.000Z');
    expect(slots[slots.length - 1].endTime.toISOString()).toContain(
      'T18:00:00.000Z',
    );
  });
});

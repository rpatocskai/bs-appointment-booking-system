import { describe, beforeEach, it, expect } from 'vitest';
import { OpeningHoursValidator } from './opening-hours.validator.js';

describe('OpeningHoursValidator', () => {
  let validator: OpeningHoursValidator;

  beforeEach(() => {
    validator = new OpeningHoursValidator();
  });

  it('ne dobjon hibát érvényes nyitvatartási időn belüli foglalásnál', () => {
    const start = new Date('2026-09-08T08:00:00.000Z');
    const end = new Date('2026-09-08T08:30:00.000Z');
    expect(() => validator.validate(start, end)).not.toThrow();
  });

  it('BadRequestException-t kell dobnia, ha a kezdés a nyitás (07:00) előtt van', () => {
    const start = new Date('2026-09-08T04:30:00.000Z');
    const end = new Date('2026-09-08T05:30:00.000Z');
    expect(() => validator.validate(start, end)).toThrow(
      'A foglalás nem kezdődhet a nyitvatartási idő előtt (07:00)',
    );
  });

  it('BadRequestException-t kell dobnia, ha a befejezés a zárás (20:00) utánra nyúlik', () => {
    const start = new Date('2026-09-08T17:30:00.000Z');
    const end = new Date('2026-09-08T18:30:00.000Z');
    expect(() => validator.validate(start, end)).toThrow(
      'A foglalás nem fejeződhet be a záróra után (20:00)',
    );
  });

  it('BadRequestException-t kell dobnia, ha a kezdés megegyezik vagy későbbi, mint a befejezés', () => {
    const start = new Date('2026-09-08T09:00:00.000Z');
    const end = new Date('2026-09-08T08:30:00.000Z');
    expect(() => validator.validate(start, end)).toThrow(
      'A kezdési időpontnak korábbinak kell lennie, mint a befejező időpont',
    );
  });
});

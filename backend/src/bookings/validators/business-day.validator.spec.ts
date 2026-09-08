import { describe, beforeEach, it, expect } from 'vitest';
import { BusinessDayValidator } from './business-day.validator.js';

describe('BusinessDayValidator', () => {
  let validator: BusinessDayValidator;

  beforeEach(() => {
    validator = new BusinessDayValidator();
  });

  it('BadRequestException-t kell dobnia, ha a kiválasztott nap Vasárnap', () => {
    const sunday = new Date('2026-09-13T12:00:00.000Z');
    expect(() => validator.validate(sunday)).toThrow(
      'A szalon vasárnap zárva tart',
    );
  });

  it('BadRequestException-t kell dobnia, ha a kiválasztott nap hivatalos ünnepnap', () => {
    const holiday = new Date('2026-08-20T12:00:00.000Z');
    expect(() => validator.validate(holiday)).toThrow(
      'A szalon munkaszüneti napokon zárva tart',
    );
  });
});

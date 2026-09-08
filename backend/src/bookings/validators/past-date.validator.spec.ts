import { BadRequestException } from '@nestjs/common';
import { PastDateValidator } from './past-date.validator.js';

describe('PastDateValidator', () => {
  let validator: PastDateValidator;
  const fakeNow = new Date('2026-09-08T12:00:00.000Z');

  beforeEach(() => {
    validator = new PastDateValidator();
  });

  it('ne dobjon hibát, ha a kiválasztott időpont a jövőben van', () => {
    const futureDate = new Date('2026-09-08T13:00:00.000Z');
    expect(() => validator.validate(futureDate, fakeNow)).not.toThrow();
  });

  it('BadRequestException-t kell dobnia, ha az időpont a múltban van', () => {
    const pastDate = new Date('2026-09-08T11:00:00.000Z');
    expect(() => validator.validate(pastDate, fakeNow)).toThrow(
      BadRequestException,
    );
  });
});

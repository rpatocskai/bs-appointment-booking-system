import { Booking } from './booking.entity.js';

describe('Booking Entity', () => {
  it('szeretnénk, ha a stringként kapott dátumokat automatikusan Date objektummá alakítaná', () => {
    const booking = new Booking({
      id: '1',
      startTime: '2026-09-08T10:00:00.000Z' as any,
      endTime: '2026-09-08T10:30:00.000Z' as any,
    });

    expect(booking.startTime).toBeInstanceOf(Date);
    expect(booking.endTime).toBeInstanceOf(Date);
  });

  describe('overlapsWith', () => {
    const existingBooking = new Booking({
      startTime: new Date('2026-09-08T10:00:00.000Z'),
      endTime: new Date('2026-09-08T10:30:00.000Z'),
    });

    it('igazat kell visszaadnia, ha a teljes átfedés van (ugyanaz az időpont)', () => {
      const overlap = existingBooking.overlapsWith(
        new Date('2026-09-08T10:00:00.000Z'),
        new Date('2026-09-08T10:30:00.000Z'),
      );
      expect(overlap).toBe(true);
    });

    it('igazat kell visszaadnia, ha az új időpont belelóg a meglévő foglalás közepébe', () => {
      const overlap = existingBooking.overlapsWith(
        new Date('2026-09-08T10:15:00.000Z'),
        new Date('2026-09-08T10:45:00.000Z'),
      );
      expect(overlap).toBe(true);
    });

    it('hamisat kell visszaadnia, ha a foglalások pont egymás után következnek (érintőleges átfedés)', () => {
      const overlap = existingBooking.overlapsWith(
        new Date('2026-09-08T10:30:00.000Z'),
        new Date('2026-09-08T11:00:00.000Z'),
      );
      expect(overlap).toBe(false);
    });
  });
});

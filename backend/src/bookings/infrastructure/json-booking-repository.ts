import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import { IBookingRepository } from '../domains/booking.repository.interface.js';
import { Booking } from '../domains/booking.entity.js';

@Injectable()
export class JsonBookingRepository implements IBookingRepository {
  private readonly filePath = path.resolve(process.cwd(), 'data/bookings.json');
  private readonly logger = new Logger(JsonBookingRepository.name);

  // (Promise chain) defense against race condition
  private writeQueue: Promise<void> = Promise.resolve();

  private async readData(): Promise<Booking[]> {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      const rawBookings = JSON.parse(data);

      return rawBookings.map((b: any) => new Booking(b));
    } catch (error) {
      if ((error as any).code === 'ENOENT') {
        this.logger.warn(
          'A bookings.json fájl nem létezik, üres tömbbel inicializálunk.',
        );
        await this.writeData([]);
        return [];
      }
      throw error;
    }
  }

  private async writeData(bookings: Booking[]): Promise<void> {
    // chaining textes
    this.writeQueue = this.writeQueue
      .then(async () => {
        const dir = path.dirname(this.filePath);
        await fs.mkdir(dir, { recursive: true });
        await fs.writeFile(
          this.filePath,
          JSON.stringify(bookings, null, 2),
          'utf-8',
        );
      })
      .catch((err) => {
        this.logger.error('Hiba a fájl írása közben:', err);
        throw err;
      });

    return this.writeQueue;
  }

  async findAll(): Promise<Booking[]> {
    return this.readData();
  }

  async findById(id: string): Promise<Booking | null> {
    const bookings = await this.readData();
    return bookings.find((b) => b.id === id) || null;
  }

  async findByEmail(email: string): Promise<Booking[]> {
    const bookings = await this.readData();
    return bookings.filter(
      (b) => b.customerEmail.toLowerCase() === email.toLowerCase(),
    );
  }

  async save(booking: Booking): Promise<Booking> {
    const bookings = await this.readData();
    const index = bookings.findIndex((b) => b.id === booking.id);

    if (index >= 0) {
      bookings[index] = booking;
    } else {
      bookings.push(booking);
    }

    await this.writeData(bookings);
    return booking;
  }

  async delete(id: string): Promise<boolean> {
    const bookings = await this.readData();
    const filtered = bookings.filter((b) => b.id !== id);

    if (filtered.length === bookings.length) {
      return false;
    }

    await this.writeData(filtered);
    return true;
  }

  async deleteAll(): Promise<void> {
    await this.writeData([]);
  }
}

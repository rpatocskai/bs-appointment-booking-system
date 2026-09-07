import { Booking } from './booking.entity.js';

export interface IBookingRepository {
  findAll(): Promise<Booking[]>;
  findById(id: string): Promise<Booking | null>;
  findByEmail(email: string): Promise<Booking[]>;
  save(booking: Booking): Promise<Booking>;
  delete(id: string): Promise<boolean>;
  deleteAll(): Promise<void>;
}

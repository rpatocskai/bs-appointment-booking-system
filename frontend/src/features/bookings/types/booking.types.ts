export interface TimeSlot {
  startTime: string;
  endTime: string;
}

export interface AvailabilityQueryParams {
  barberId: string;
  date: string;
}

export interface CreateBookingPayload {
  barberId: string;
  customerEmail: string;
  startTime: string;
  endTime: string;
}

export interface UserBooking {
  id: string;
  barberId: string;
  customerEmail: string;
  startTime: string; // ISO string
  endTime: string; // ISO string
  createdAt: string;
}

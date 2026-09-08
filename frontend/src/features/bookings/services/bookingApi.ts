import { apiClient } from "../../../api/clients";
import type {
  AvailabilityQueryParams,
  CreateBookingPayload,
  TimeSlot,
  UserBooking,
} from "../types/booking.types";

export const bookingsApi = {
  getAvailability: async (
    params: AvailabilityQueryParams,
  ): Promise<TimeSlot[]> => {
    const response = await apiClient.get<TimeSlot[]>("/bookings/availability", {
      params,
    });
    return response.data;
  },

  createBooking: async (payload: CreateBookingPayload): Promise<unknown> => {
    const response = await apiClient.post<unknown>("/bookings", payload);
    return response.data;
  },

  getBookingsByEmail: async (email: string): Promise<UserBooking[]> => {
    const response = await apiClient.get<UserBooking[]>("/bookings", {
      params: { email },
    });
    return response.data;
  },

  deleteBooking: async (id: string): Promise<void> => {
    await apiClient.delete<void>(`/bookings/${id}`);
  },
};

import { apiClient } from "../../../api/clients";
import type {
  AvailabilityQueryParams,
  CreateBookingPayload,
  TimeSlot,
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
};

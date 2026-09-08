import { apiClient } from "../../../api/clients";
import type { AvailabilityQueryParams, TimeSlot } from "../types/booking.types";

export const bookingsApi = {
  getAvailability: async (
    params: AvailabilityQueryParams,
  ): Promise<TimeSlot[]> => {
    const response = await apiClient.get<TimeSlot[]>("/bookings/availability", {
      params,
    });
    return response.data;
  },
};

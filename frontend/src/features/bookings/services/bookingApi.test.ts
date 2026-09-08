import { describe, it, expect, vi, beforeEach } from "vitest";
import { bookingsApi } from "./bookingApi";
import type { CreateBookingPayload } from "../types/booking.types";
import { apiClient } from "../../../api/clients";

// Kimockoljuk a modult, de hagyjuk, hogy a TypeScript felismerje az eredeti Axios struktúrát
vi.mock("../../../../api/clients", () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe("bookingsApi - createBooking (Unit)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("sikeresen meg kell hívnia a POST /bookings végpontot a megfelelő adatokkal", async () => {
    const mockPayload: CreateBookingPayload = {
      barberId: "barber-123",
      customerEmail: "vendegh@email.hu",
      startTime: "2026-09-09T08:00:00.000Z",
      endTime: "2026-09-09T08:30:00.000Z",
    };

    const mockResponse = { data: { id: "booking-uuid-123", ...mockPayload } };

    // Típusbiztos spyOn használata casting nélkül
    vi.spyOn(apiClient, "post").mockResolvedValueOnce(mockResponse);

    const result = await bookingsApi.createBooking(mockPayload);

    expect(apiClient.post).toHaveBeenCalledWith("/bookings", mockPayload);
    expect(result).toEqual(mockResponse.data);
  });

  it("kezelnie kell, ha a backend hibát dob a mentés során", async () => {
    const mockPayload: CreateBookingPayload = {
      barberId: "barber-123",
      customerEmail: "vendegh@email.hu",
      startTime: "2026-09-09T08:00:00.000Z",
      endTime: "2026-09-09T08:30:00.000Z",
    };

    const mockError = new Error("Conflict - Az időpont már foglalt");

    // Típusbiztos spyOn használata casting nélkül
    vi.spyOn(apiClient, "post").mockRejectedValueOnce(mockError);

    await expect(bookingsApi.createBooking(mockPayload)).rejects.toThrow(
      "Conflict - Az időpont már foglalt",
    );
  });
});

import { renderHook, waitFor } from "@testing-library/react";
import { useAvailability } from "./useAvailability";
import { bookingsApi } from "../services/bookingApi";
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mocking
vi.mock("../services/bookingApi", () => ({
  bookingsApi: {
    getAvailability: vi.fn(),
  },
}));

describe("useAvailability Hook (Unit)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("üres értékeket kell visszaadnia derived state-ként, ha nincs barberId vagy date", () => {
    const { result } = renderHook(() => useAvailability(null, ""));

    expect(result.current.slots).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(bookingsApi.getAvailability).not.toHaveBeenCalled();
  });

  it("sikeresen be kell töltenie az idősávokat az API-ból", async () => {
    const mockSlots = [
      {
        startTime: "2026-09-08T07:00:00.000Z",
        endTime: "2026-09-08T07:30:00.000Z",
      },
    ];
    vi.mocked(bookingsApi.getAvailability).mockResolvedValueOnce(mockSlots);

    const { result } = renderHook(() =>
      useAvailability("barber-1", "2026-09-08"),
    );

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.slots).toEqual(mockSlots);
    expect(result.current.error).toBeNull();
  });

  it("kezelnie kell az API hibákat", async () => {
    const mockAxiosError = {
      isAxiosError: true,
      response: {
        data: { message: "A szalon ezen a napon zárva tart" },
      },
    };

    vi.mocked(bookingsApi.getAvailability).mockRejectedValueOnce(
      mockAxiosError,
    );

    const { result } = renderHook(() =>
      useAvailability("barber-1", "2026-09-08"),
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.slots).toEqual([]);
    expect(result.current.error).toBe("A szalon ezen a napon zárva tart");
  });
});

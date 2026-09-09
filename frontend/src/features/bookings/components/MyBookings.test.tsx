import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MyBookings } from "./MyBookings";
import { bookingsApi } from "../services/bookingApi";
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Barber } from "../../barbers/types/barber.types";

vi.mock("../services/bookingApi", () => ({
  bookingsApi: {
    getBookingsByEmail: vi.fn(),
    deleteBooking: vi.fn(),
  },
}));

describe("MyBookings Komponens Integráció (Egyedi gombokkal)", () => {
  const mockBarbers: Barber[] = [
    { id: "b1", name: "Gedeon", workSchedule: {} },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("ki kell listáznia a foglalásokat és meg kell jelenítenie a megerősítő ablakot lemondáskor", async () => {
    const mockUserBookings = [
      {
        id: "booking-1",
        barberId: "b1",
        customerEmail: "teszt@hu.hu",
        startTime: "2026-09-09T14:00:00.000Z",
        endTime: "2026-09-09T14:30:00.000Z",
        createdAt: "",
      },
    ];

    vi.mocked(bookingsApi.getBookingsByEmail).mockResolvedValueOnce(
      mockUserBookings,
    );

    render(<MyBookings barbers={mockBarbers} />);

    const emailInput = screen.getByPlaceholderText("pelda@email.hu");
    fireEvent.change(emailInput, { target: { value: "teszt@hu.hu" } });

    const searchButton = screen.getByRole("button", { name: "Keresés" });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText("Gedeon")).toBeInTheDocument();
    });

    const cancelButton = screen.getByRole("button", { name: "Lemondás" });
    fireEvent.click(cancelButton);

    expect(screen.getByText("Időpont lemondása")).toBeInTheDocument();
    expect(
      screen.getByText(/Biztosan szeretnéd lemondani ezt az időpontot\?/i),
    ).toBeInTheDocument();
  });
});

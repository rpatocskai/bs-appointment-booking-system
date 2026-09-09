import { render, screen, fireEvent } from "@testing-library/react";
import { MyBookingsTable } from "./MyBookingsTable";
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Barber } from "../../barbers/types/barber.types";
import type { UserBooking } from "../types/booking.types";

describe("MyBookingsTable Komponens (Unit)", () => {
  const mockBarbers: Barber[] = [
    { id: "barber-abc", name: "Pengés Péter", workSchedule: {} },
  ];

  const mockBookings: UserBooking[] = [
    {
      id: "booking-123",
      barberId: "barber-abc",
      customerEmail: "vendegh@email.hu",
      startTime: "2026-09-09T08:00:00.000Z",
      endTime: "2026-09-09T08:30:00.000Z",
      createdAt: "2026-09-08T12:00:00.000Z",
    },
  ];

  const defaultProps = {
    bookings: mockBookings,
    barbers: mockBarbers,
    onDeleteClick: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("ki kell renderelnie a fejlécet és a kapott foglalási adatokat", () => {
    render(<MyBookingsTable {...defaultProps} />);

    expect(screen.getAllByText(/Borbély/i)[0]).toBeInTheDocument();
    expect(screen.getByText("Kezdés időpontja")).toBeInTheDocument();

    expect(screen.getAllByText("Pengés Péter")[0]).toBeInTheDocument();
    expect(
      screen.getAllByText(/2026\. 09\. 09\.? 10:00/i)[0],
    ).toBeInTheDocument();
  });

  it("meg kell jelenítenie az Ismeretlen Borbély feliratot, ha a barberId nem található a listában", () => {
    const invalidBooking = [{ ...mockBookings[0], barberId: "nem-letezo-id" }];
    render(<MyBookingsTable {...defaultProps} bookings={invalidBooking} />);

    expect(screen.getAllByText("Ismeretlen Borbély")[0]).toBeInTheDocument();
  });

  it("meghíváskor át kell adnia a pontos foglalási adatot az onDeleteClick callbacknek", () => {
    render(<MyBookingsTable {...defaultProps} />);

    const deleteButton = screen.getAllByRole("button", { name: "Lemondás" })[0];
    expect(deleteButton).toBeInTheDocument();

    fireEvent.click(deleteButton);

    expect(defaultProps.onDeleteClick).toHaveBeenCalledWith(mockBookings[0]);
  });
});

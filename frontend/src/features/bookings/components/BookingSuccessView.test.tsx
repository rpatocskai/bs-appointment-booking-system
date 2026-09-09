import { render, screen, fireEvent } from "@testing-library/react";
import { BookingSuccessView } from "./BookingSuccessView";
import { describe, it, expect, vi } from "vitest";
import type { TimeSlot } from "../types/booking.types";

describe("BookingSuccessView Komponens (Unit)", () => {
  const mockSlot: TimeSlot = {
    startTime: "2026-09-09T12:00:00.000Z",
    endTime: "2026-09-09T12:30:00.000Z",
  };

  const defaultProps = {
    barberName: "Gedeon Bácsi",
    selectedDate: "2026-09-09",
    selectedSlot: mockSlot,
    savedEmail: "kliens@gmail.com",
    onClose: vi.fn(),
  };

  it("meg kell jelenítenie a sikeres foglalás adatait és a visszaigazoló e-mailt", () => {
    render(<BookingSuccessView {...defaultProps} />);

    expect(screen.getByText("SIKERES FOGLALÁS!")).toBeInTheDocument();
    expect(screen.getByText("Gedeon Bácsi")).toBeInTheDocument();
    expect(screen.getByText("kliens@gmail.com")).toBeInTheDocument();
  });

  it("be kell zárnia a popupot, ha a felhasználó a saját Bezárás gombunkra kattint", () => {
    render(<BookingSuccessView {...defaultProps} />);

    const closeButton = screen.getByRole("button", { name: "Bezárás" });
    fireEvent.click(closeButton);

    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });
});

import { render, screen, fireEvent } from "@testing-library/react";
import { DateTimeSelector } from "./DateTimeSelector";
import { useAvailability } from "../hooks/useAvailability";
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../hooks/useAvailability");

describe("DateTimeSelector Komponens (Integration)", () => {
  const defaultProps = {
    selectedBarberId: "barber-1",
    selectedBarberName: "Gedeon Bácsi",
    selectedDate: "2026-09-08",
    onDateChange: vi.fn(),
    selectedSlot: null,
    onSlotSelect: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("meg kell jelenítenie a betöltési animációt (CircularProgress)", () => {
    vi.mocked(useAvailability).mockReturnValue({
      slots: [],
      loading: true,
      error: null,
    });

    render(<DateTimeSelector {...defaultProps} />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("meg kell jelenítenie a hibaüzenetet, ha az API hibát dob", () => {
    vi.mocked(useAvailability).mockReturnValue({
      slots: [],
      loading: false,
      error: "Hiba történt az idősávok lekérésekor",
    });

    render(<DateTimeSelector {...defaultProps} />);
    expect(
      screen.getByText("Hiba történt az idősávok lekérésekor"),
    ).toBeInTheDocument();
  });

  it("meg kell jelenítenie az üres állapot üzenetet, ha nincs elérhető slot", () => {
    vi.mocked(useAvailability).mockReturnValue({
      slots: [],
      loading: false,
      error: null,
    });

    render(<DateTimeSelector {...defaultProps} />);
    expect(
      screen.getByText(
        "Ezen a napon nincs elérhető szabad időpont, vagy a szalon zárva tart.",
      ),
    ).toBeInTheDocument();
  });

  it("ki kell renderelnie az elérhető idősávokat és kezelnie kell a kattintást", () => {
    const mockSlots = [
      {
        startTime: "2026-09-08T07:00:00.000Z",
        endTime: "2026-09-08T07:30:00.000Z",
      },
    ];

    vi.mocked(useAvailability).mockReturnValue({
      slots: mockSlots,
      loading: false,
      error: null,
    });

    render(<DateTimeSelector {...defaultProps} />);

    expect(screen.getByText("IDŐPONT VÁLASZTÁSA")).toBeInTheDocument();
    expect(screen.getByText("Gedeon Bácsi")).toBeInTheDocument();

    const slotButton = screen.getByRole("button", { name: "09:00" });
    expect(slotButton).toBeInTheDocument();

    fireEvent.click(slotButton);
    expect(defaultProps.onSlotSelect).toHaveBeenCalledWith(mockSlots[0]);
  });
});

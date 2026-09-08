import { render, screen, fireEvent } from "@testing-library/react";
import { BookingPage } from "./BookingPage";
import { useBarbers } from "../features/barbers/hooks/useBarber";
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Barber } from "../features/barbers/types/barber.types";

vi.mock("../features/barbers/hooks/useBarber");

vi.mock("../features/barbers/components/BarberSelector", () => ({
  BarberSelector: ({
    barbers,
    onSelectBarber,
  }: {
    barbers: Barber[];
    selectedBarberId?: string;
    onSelectBarber: (barber: Barber) => void;
  }) => (
    <div data-testid="barber-selector">
      {barbers.map((b) => (
        <button key={b.id} onClick={() => onSelectBarber(b)}>
          Select Barber {b.name}
        </button>
      ))}
    </div>
  ),
}));

vi.mock("../features/bookings/components/DateTimeSelector", () => ({
  DateTimeSelector: () => (
    <div data-testid="datetime-selector">Date Time Selector</div>
  ),
}));

describe("BookingPage Komponens", () => {
  const mockBarber: Barber = {
    id: "b1",
    name: "Gedeon",
    workSchedule: {
      monday: { start: "07:00", end: "20:00" },
      tuesday: { start: "07:00", end: "20:00" },
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("meg kell jelenítenie a betöltési indikátort, ha isLoading true", () => {
    vi.mocked(useBarbers).mockReturnValue({
      barbers: [],
      isLoading: true,
      error: null,
    });

    render(<BookingPage />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("meg kell jelenítenie a hibaüzenetet, ha hiba történik", () => {
    vi.mocked(useBarbers).mockReturnValue({
      barbers: [],
      isLoading: false,
      error: "Hiba a borbélyok betöltésekor",
    });

    render(<BookingPage />);
    expect(
      screen.getByText("Hiba a borbélyok betöltésekor"),
    ).toBeInTheDocument();
  });

  it("sikeresen ki kell renderelnie a borbélyválasztót, ha sikeres az adatletöltés", () => {
    vi.mocked(useBarbers).mockReturnValue({
      barbers: [mockBarber],
      isLoading: false,
      error: null,
    });

    render(<BookingPage />);
    expect(screen.getByTestId("barber-selector")).toBeInTheDocument();
    expect(screen.queryByTestId("datetime-selector")).not.toBeInTheDocument();
  });

  it("borbély kiválasztásakor meg kell jelennie a popupnak (naptárnak)", async () => {
    vi.mocked(useBarbers).mockReturnValue({
      barbers: [mockBarber],
      isLoading: false,
      error: null,
    });

    render(<BookingPage />);

    expect(screen.queryByTestId("datetime-selector")).not.toBeInTheDocument();

    fireEvent.click(screen.getByText("Select Barber Gedeon"));

    expect(screen.getByTestId("datetime-selector")).toBeInTheDocument();
  });
});

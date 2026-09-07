import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BarberSelector } from "./components/BarberSelector";
import type { Barber } from "./types/barber.types";

// Mock data
const mockBarbers: Barber[] = [
  {
    id: "b-1",
    name: "Kovács János",
    workSchedule: {
      monday: { start: "08:00", end: "16:00" },
      saturday: { start: "09:00", end: "14:00" },
    },
  },
  {
    id: "b-2",
    name: "Szabó Márk",
    workSchedule: {
      monday: { start: "10:00", end: "18:00" },
      saturday: { start: "08:00", end: "12:00" },
    },
  },
];

describe("BarberSelector Komponens", () => {
  it("megjeleníti a főcímet, az alcímet és az összes átadott borbély kártyáját", () => {
    render(<BarberSelector barbers={mockBarbers} onSelectBarber={vi.fn()} />);

    // 1. Check static texts and titles
    expect(
      screen.getByRole("heading", { name: /válassz mesterborbélyt/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/tapasztalt borbélyaink készen állnak/i),
    ).toBeInTheDocument();

    // 2. Check barber names
    expect(screen.getByText("Kovács János")).toBeInTheDocument();
    expect(screen.getByText("Szabó Márk")).toBeInTheDocument();
  });

  it("helyesen továbbítja a kijelölést a szülő felé, ha a listában rákattintanak egy borbélyra", async () => {
    const handleSelectBarber = vi.fn();

    render(
      <BarberSelector
        barbers={mockBarbers}
        onSelectBarber={handleSelectBarber}
      />,
    );

    // Check button names
    const buttons = screen.getAllByRole("button", {
      name: /borbély kiválasztása/i,
    });

    // Click second barber button
    await userEvent.click(buttons[1]);

    // Expect parent callback function have been called with the exact barber
    expect(handleSelectBarber).toHaveBeenCalledTimes(1);
    expect(handleSelectBarber).toHaveBeenCalledWith(mockBarbers[1]);
  });

  it("a kiválasztott ID alapján a megfelelő kártyának adja át az isSelected állapotot", () => {
    render(
      <BarberSelector
        barbers={mockBarbers}
        selectedBarberId="b-2" // Szabó Márk selected
        onSelectBarber={vi.fn()}
      />,
    );

    //  If barberCard selected the button text change to 'Kiválasztva'
    // Check button and connected to a barber
    expect(
      screen.getByRole("button", { name: /kiválasztva/i }),
    ).toBeInTheDocument();

    // First barber state still the original
    expect(
      screen.getByRole("button", { name: /borbély kiválasztása/i }),
    ).toBeInTheDocument();
  });

  it("nem omlik össze és üres listát kezel, ha a barbers tömb üres", () => {
    render(<BarberSelector barbers={[]} onSelectBarber={vi.fn()} />);

    // Check titles display
    expect(
      screen.getByRole("heading", { name: /válassz mesterborbélyt/i }),
    ).toBeInTheDocument();

    // Check buttons and card hidden state
    expect(screen.queryByRole("button")).toBeNull();
  });
});

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BarberCard } from "./BarberCard";
import type { Barber } from "../types/barber.types";

// Mock Data
const mockBarber: Barber = {
  id: "abc-123",
  name: "Teszt Jakab",
  workSchedule: {
    monday: { start: "09:00", end: "17:00" },
    saturday: { start: "10:00", end: "14:00" },
  },
};

describe("BarberCard Komponens", () => {
  it("helyesen jeleníti meg a borbély nevét és nyitvatartását", () => {
    render(
      <BarberCard barber={mockBarber} isSelected={false} onSelect={vi.fn()} />,
    );

    // Check name
    expect(screen.getByText("Teszt Jakab")).toBeInTheDocument();

    // Check monday workschedule
    expect(screen.getByText("09:00 – 17:00")).toBeInTheDocument();
  });

  it("változtatja a gomb szövegét ha ki van választva", () => {
    // 1. Test none selection
    const { rerender } = render(
      <BarberCard barber={mockBarber} isSelected={false} onSelect={vi.fn()} />,
    );
    expect(
      screen.getByRole("button", { name: /borbély kiválasztása/i }),
    ).toBeInTheDocument();

    // 2. Render parent prop change in the selected state
    rerender(
      <BarberCard barber={mockBarber} isSelected={true} onSelect={vi.fn()} />,
    );
    expect(
      screen.getByRole("button", { name: /kiválasztva/i }),
    ).toBeInTheDocument();
  });

  it("visszajelez a szülő komponensnek a borbély objektummal ha rákattintanak a gombra", async () => {
    const handleSelect = vi.fn();
    render(
      <BarberCard
        barber={mockBarber}
        isSelected={false}
        onSelect={handleSelect}
      />,
    );

    const button = screen.getByRole("button", {
      name: /borbély kiválasztása/i,
    });
    await userEvent.click(button);

    // Expect callback run and get the exact barber data
    expect(handleSelect).toHaveBeenCalledWith(mockBarber);
  });
});

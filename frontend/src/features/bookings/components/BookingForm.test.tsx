import { render, screen, fireEvent } from "@testing-library/react";
import { BookingForm } from "./BookingForm";
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { TimeSlot } from "../types/booking.types";

beforeEach(() => {
  window.HTMLElement.prototype.scrollIntoView = vi.fn();
});

describe("BookingForm Komponens (Unit)", () => {
  const mockSlot: TimeSlot = {
    startTime: "2026-09-09T07:00:00.000Z",
    endTime: "2026-09-09T07:30:00.000Z",
  };

  const defaultProps = {
    barberName: "Borotvás Béla",
    selectedDate: "2026-09-09",
    selectedSlot: mockSlot,
    onSubmit: vi.fn(),
    isSubmitting: false,
    submitError: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("meg kell jelenítenie az időpont részleteit az összegző panelen", () => {
    render(<BookingForm {...defaultProps} />);

    expect(screen.getByText("FOGLALÁS VÉGLEGESÍTÉSE")).toBeInTheDocument();
    expect(screen.getByText("Borotvás Béla")).toBeInTheDocument();
    expect(screen.getByText("2026-09-09")).toBeInTheDocument();
    expect(screen.getByText(/09:00 – 09:30/i)).toBeInTheDocument();
  });

  it("hibaüzenetet kell megjelenítenie, ha az e-mail mező üresen marad a beküldéskor", () => {
    render(<BookingForm {...defaultProps} />);

    const submitButton = screen.getByRole("button", {
      name: "Időpont lefoglalása",
    });
    fireEvent.click(submitButton);

    expect(
      screen.getByText("Az e-mail cím megadása kötelező"),
    ).toBeInTheDocument();
    expect(defaultProps.onSubmit).not.toHaveBeenCalled();
  });

  it("hibaüzenetet kell megjelenítenie, ha az e-mail formátuma hibás", () => {
    render(<BookingForm {...defaultProps} />);

    const emailInput = screen.getByPlaceholderText("pelda@email.hu");
    fireEvent.change(emailInput, { target: { value: "rossz-email-formatum" } });

    const submitButton = screen.getByRole("button", {
      name: "Időpont lefoglalása",
    });
    fireEvent.click(submitButton);

    expect(
      screen.getByText("Érvénytelen e-mail cím formátum"),
    ).toBeInTheDocument();
    expect(defaultProps.onSubmit).not.toHaveBeenCalled();
  });

  it("megfelelően át kell adnia az adatokat az onSubmit függvénynek érvényes e-mail esetén", () => {
    render(<BookingForm {...defaultProps} />);

    const emailInput = screen.getByPlaceholderText("pelda@email.hu");
    fireEvent.change(emailInput, { target: { value: "vendegh@gmail.com" } });

    const submitButton = screen.getByRole("button", {
      name: "Időpont lefoglalása",
    });
    fireEvent.click(submitButton);

    expect(defaultProps.onSubmit).toHaveBeenCalledWith("vendegh@gmail.com");
  });

  it("le kell tiltania az inputot és a gombot, ha a beküldés folyamatban van (isSubmitting)", () => {
    render(<BookingForm {...defaultProps} isSubmitting={true} />);

    const emailInput = screen.getByPlaceholderText("pelda@email.hu");
    const submitButton = screen.getByRole("button", {
      name: "Foglalás rögzítése...",
    });

    expect(emailInput).toBeDisabled();
    expect(submitButton).toBeDisabled();
  });

  it("meg kell jelenítenie a backendről érkező szerveroldali hibaüzenetet", () => {
    const backendError =
      "Ez az idősáv időközben betelt. Kérjük, válassz másikat!";
    render(<BookingForm {...defaultProps} submitError={backendError} />);

    expect(screen.getByText(backendError)).toBeInTheDocument();
  });
});

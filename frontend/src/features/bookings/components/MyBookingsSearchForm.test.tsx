import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MyBookingsSearchForm } from "./MyBookingsSearchForm";
import { describe, it, expect, vi, beforeEach } from "vitest";

describe("MyBookingsSearchForm Komponens (Unit)", () => {
  const defaultProps = {
    onSearch: vi.fn(),
    loading: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("meg kell jelenítenie a beviteli mezőt és a kereső gombot", () => {
    render(<MyBookingsSearchForm {...defaultProps} />);

    expect(screen.getByPlaceholderText("pelda@email.hu")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Keresés" })).toBeInTheDocument();
  });

  it("hibaüzenetet kell dobnia, ha üres mezővel küldik be a formot", () => {
    render(<MyBookingsSearchForm {...defaultProps} />);

    const searchButton = screen.getByRole("button", { name: "Keresés" });
    fireEvent.click(searchButton);

    expect(
      screen.getByText("Az e-mail cím megadása kötelező"),
    ).toBeInTheDocument();
    expect(defaultProps.onSearch).not.toHaveBeenCalled();
  });

  it("hibaüzenetet kell dobnia, ha az e-mail formátuma érvénytelen", () => {
    render(<MyBookingsSearchForm {...defaultProps} />);

    const emailInput = screen.getByPlaceholderText("pelda@email.hu");
    fireEvent.change(emailInput, { target: { value: "hibasemailformatum" } });

    const searchButton = screen.getByRole("button", { name: "Keresés" });
    fireEvent.click(searchButton);

    expect(
      screen.getByText("Érvénytelen e-mail cím formátum"),
    ).toBeInTheDocument();
    expect(defaultProps.onSearch).not.toHaveBeenCalled();
  });

  it("sikeres validáció esetén meg kell hívnia az onSearch callbacket", async () => {
    defaultProps.onSearch.mockResolvedValue(Promise.resolve());
    render(<MyBookingsSearchForm {...defaultProps} />);

    const emailInput = screen.getByPlaceholderText("pelda@email.hu");
    fireEvent.change(emailInput, { target: { value: "vendegh@gmail.com" } });

    const searchButton = screen.getByRole("button", { name: "Keresés" });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(defaultProps.onSearch).toHaveBeenCalledWith("vendegh@gmail.com");
    });
  });

  it("le kell tiltania a gombot és az inputot betöltési állapot alatt (loading)", () => {
    render(<MyBookingsSearchForm {...defaultProps} loading={true} />);

    const emailInput = screen.getByPlaceholderText("pelda@email.hu");
    expect(emailInput).toBeDisabled();
    expect(screen.queryByText("Keresés")).not.toBeInTheDocument();
  });
});

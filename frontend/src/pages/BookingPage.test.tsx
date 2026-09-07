import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BookingPage } from "./BookingPage";
import { barbersApi } from "../features/barbers/services/barbersApi";

// Mock data
const mockApiBarbers = [
  {
    id: "b-1",
    name: "Kovács János",
    workSchedule: {
      monday: { start: "08:00", end: "16:00" },
      saturday: { start: "09:00", end: "14:00" },
    },
  },
];

describe("BookingPage Integrációs Teszt", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("mutatja a töltőképernyőt, majd a sikeres API hívás után kilistázza a borbélyokat és kezeli a kijelölést", async () => {
    // 1. Fishing api call, and force to mock data usage
    const apiMock = vi
      .spyOn(barbersApi, "getAll")
      .mockResolvedValue(mockApiBarbers);

    // 2. Render all page
    render(<BookingPage />);

    // 3. Check cirgularprogress (loading animation)
    // MUI CircularProgress get 'progressbar' role
    expect(screen.getByRole("progressbar")).toBeInTheDocument();

    // 4. Check loading animation diappear
    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).toBeNull();
    });

    // Check barber name display
    expect(screen.getByText("Kovács János")).toBeInTheDocument();

    // 5. Test all of the flow
    const selectButton = screen.getByRole("button", {
      name: /borbély kiválasztása/i,
    });
    await userEvent.click(selectButton);

    // 6. Button text must be change to 'Kiválasztva'
    expect(
      screen.getByRole("button", { name: /kiválasztva/i }),
    ).toBeInTheDocument();

    expect(apiMock).toHaveBeenCalledTimes(1);
  });

  it("megjeleníti a hibaüzenetet a képernyőn, ha az API hívás elbukik", async () => {
    // Check api error
    vi.spyOn(barbersApi, "getAll").mockRejectedValue(
      new Error("Hálózati hiba"),
    );

    render(<BookingPage />);

    // Wait to loading end
    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).toBeNull();
    });

    // Check error message
    expect(screen.getByText("Hálózati hiba")).toBeInTheDocument();
  });
});

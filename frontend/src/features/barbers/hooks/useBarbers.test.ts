import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { barbersApi } from "../services/barbersApi";
import { useBarbers } from "./useBarber";

describe("useBarbers Custom Hook", () => {
  // Restore all mocks
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("kezdetben loading állapotban van, majd sikeresen betölti az adatokat", async () => {
    // 1. Catch barbersApi.getAll and change to mock answer
    const mockData = [
      {
        id: "1",
        name: "Sipos Péter",
        workSchedule: {
          monday: { start: "8", end: "12" },
          saturday: { start: "0", end: "0" },
        },
      },
    ];
    const apiMock = vi.spyOn(barbersApi, "getAll").mockResolvedValue(mockData);

    // 2. Start hook
    const { result } = renderHook(() => useBarbers());

    // 3. Check base state (useEffect runs yet)
    expect(result.current.isLoading).toBe(true);
    expect(result.current.barbers).toEqual([]);
    expect(result.current.error).toBeNull();

    // 4. Wait the end of the async and state refresh
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // 5. Check finish data
    expect(result.current.barbers).toEqual(mockData);
    expect(result.current.error).toBeNull();
    expect(apiMock).toHaveBeenCalledTimes(1);
  });

  it("kezeli a hálózati hibákat és beállítja az error állapotot", async () => {
    // 1. Check api error
    vi.spyOn(barbersApi, "getAll").mockRejectedValue(
      new Error("Szerverhiba történt"),
    );

    const { result } = renderHook(() => useBarbers());

    // 2. Wait loading finish
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // 3. Check error message diplays
    expect(result.current.error).toBe("Szerverhiba történt");
    expect(result.current.barbers).toEqual([]);
  });
});

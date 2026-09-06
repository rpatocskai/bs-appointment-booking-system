import { useState, useEffect } from "react";
import type { Barber } from "../types/barber.types";
import { barbersApi } from "../services/barbersApi";

export const useBarbers = () => {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBarbers = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await barbersApi.getAll();
        setBarbers(data);
      } catch (err: unknown) {
        console.error("Hiba a borbélyok lekérésekor:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Nem sikerült betölteni a borbélyokat.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchBarbers();
  }, []);

  return { barbers, isLoading, error };
};

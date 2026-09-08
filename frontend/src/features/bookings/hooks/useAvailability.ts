import { useState, useEffect } from "react";
import { bookingsApi } from "../services/bookingApi";
import type { TimeSlot } from "../types/booking.types";
import axios from "axios";

export const useAvailability = (barberId: string | null, date: string) => {
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!barberId || !date) {
      return;
    }

    let isCurrent = true;

    const fetchAvailability = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await bookingsApi.getAvailability({ barberId, date });
        if (isCurrent) {
          setSlots(data);
        }
      } catch (err: unknown) {
        if (isCurrent) {
          if (axios.isAxiosError(err) && err.response?.data?.message) {
            setError(err.response.data.message);
          } else {
            setError(
              err instanceof Error
                ? err.message
                : "Nem sikerült az idősávok betöltése.",
            );
          }
          setSlots([]);
        }
      } finally {
        if (isCurrent) {
          setLoading(false);
        }
      }
    };

    fetchAvailability();

    return () => {
      isCurrent = false;
    };
  }, [barberId, date]);

  const hasRequiredParams = Boolean(barberId && date);

  return {
    slots: hasRequiredParams ? slots : [],
    loading: hasRequiredParams ? loading : false,
    error: hasRequiredParams ? error : null,
  };
};

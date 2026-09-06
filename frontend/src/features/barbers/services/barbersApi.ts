import { apiClient } from "../../../api/clients";
import type { Barber } from "../types/barber.types";

export const barbersApi = {
  getAll: async (): Promise<Barber[]> => {
    const response = await apiClient.get<Barber[]>("/barbers");
    return response.data;
  },
};

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "@/config/config";

export const usePing = () => {
  return useQuery({
    queryKey: ["ping"],
    queryFn: async () => {
      const { data } = await axios.get<{ message: string }>(`${API_URL}`);
      return data;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchInterval: false,
    retry: true,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchIntervalInBackground: false,
  });
};

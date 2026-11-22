import { useQuery } from "@tanstack/react-query";
import { fetchEvent } from "../api/events";

export const useEvent = (id: number | null) =>
  useQuery({
    queryKey: ["event", id],
    queryFn: ({ signal }) => {
      if (id === null) {
        throw new Error("Sündmuse ID puudub.");
      }

      return fetchEvent(id, signal);
    },
    enabled: id !== null,
    retry: false,
    networkMode: "always",
  });
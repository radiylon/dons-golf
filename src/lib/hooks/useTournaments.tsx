"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchTournaments } from "../api";

export function useTournaments() {
  return useQuery({
    queryKey: ["tournaments"],
    queryFn: fetchTournaments,
    staleTime: 5 * 60_000,
  });
}
"use client";

import { useQuery } from "@tanstack/react-query";
import type { PulseColumn } from "@/features/pulse/types";
import { fetchPulseColumn } from "@/features/pulse/api";

export function usePulseColumn(column: PulseColumn) {
  return useQuery({
    queryKey: ["pulse", "column", column],
    queryFn: () => fetchPulseColumn(column),
  });
}

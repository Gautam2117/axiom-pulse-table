"use client";

import * as React from "react";
import type { TokenRow } from "@/features/pulse/types";
import type { PulseColumn } from "@/features/pulse/types";
import { useAppSelector } from "@/lib/redux-hooks";

export function useSortedTokens(column: PulseColumn, items: TokenRow[]) {
  const sort = useAppSelector((s) => s.pulse.sortBy[column]);

  return React.useMemo(() => {
    const arr = [...items];

    const dir = sort.dir === "asc" ? 1 : -1;
    const key = sort.key;

    arr.sort((a, b) => {
      const av = a[key as keyof TokenRow];
      const bv = b[key as keyof TokenRow];
      if (av < bv) return -1 * dir;
      if (av > bv) return 1 * dir;
      return a.id.localeCompare(b.id);
    });

    return arr;
  }, [items, sort.dir, sort.key]);
}

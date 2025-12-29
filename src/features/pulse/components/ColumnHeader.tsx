"use client";

import * as React from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux-hooks";
import type { PulseColumn } from "@/features/pulse/types";
import { setSort } from "@/features/pulse/pulseSlice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Filter } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type SortKey = "age" | "marketCap" | "liquidity" | "volume" | "txns" | "holders";

const SORTS: Array<{ key: SortKey; label: string }> = [
  { key: "age", label: "Age" },
  { key: "marketCap", label: "Market Cap" },
  { key: "liquidity", label: "Liquidity" },
  { key: "volume", label: "Volume" },
  { key: "txns", label: "Txns" },
  { key: "holders", label: "Holders" },
];

export function ColumnHeader({
  column,
  title,
  hint,
  isLoading,
}: {
  column: PulseColumn;
  title: string;
  hint: string;
  isLoading: boolean;
}) {
  const dispatch = useAppDispatch();

  // If your slice already types this, great.
  // If it’s currently `string`, we safely narrow for display and dispatch.
  const sort = useAppSelector((s) => s.pulse.sortBy[column]) as {
    key: SortKey;
    dir: "asc" | "desc";
  };

  return (
    <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <div className="truncate text-[15px] font-semibold text-white">
            {title}
          </div>
          <span className="rounded-md bg-white/10 px-2 py-[2px] text-[11px] text-white/80">
            {isLoading ? "Loading" : "Live"}
          </span>
        </div>
        <div className="mt-1 truncate text-[12px] text-white/60">{hint}</div>
      </div>

      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-white/80 hover:bg-white/10 hover:text-white"
              aria-label="Filters"
              type="button"
            >
              <Filter className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="text-xs">
            Filters (UI stub for now)
          </TooltipContent>
        </Tooltip>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              className="h-9 gap-2 px-3 text-[12px] text-white/80 hover:bg-white/10 hover:text-white"
            >
              <ArrowUpDown className="h-4 w-4" />
              <span className="hidden sm:inline">
                {SORTS.find((x) => x.key === sort.key)?.label ?? sort.key} (
                {sort.dir})
              </span>
            </Button>
          </DropdownMenuTrigger>

          {/* FIX: dark menu + white text (no black-on-black) */}
          <DropdownMenuContent
            align="end"
            className="w-52 border-white/10 bg-[#0b0f14] text-white shadow-xl"
          >
            {SORTS.map((s) => (
              <DropdownMenuItem
                key={s.key}
                className="cursor-pointer text-white/85 focus:bg-white/10 focus:text-white"
                onClick={() => dispatch(setSort({ column, key: s.key }))}
              >
                {s.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

"use client";

import { useAppDispatch, useAppSelector } from "@/lib/redux-hooks";
import type { PulseColumn } from "@/features/pulse/types";
import { setSort } from "@/features/pulse/pulseSlice";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Filter } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const SORTS: Array<{ key: any; label: string }> = [
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
  const sort = useAppSelector((s) => s.pulse.sortBy[column]);

  return (
    <div className="flex items-center justify-between gap-2 border-b border-white/10 px-3 py-2">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <div className="truncate text-sm font-semibold">{title}</div>
          <span className="rounded-md bg-white/10 px-2 py-[2px] text-[11px] text-white/70">
            {isLoading ? "Loading" : "Live"}
          </span>
        </div>
        <div className="truncate text-[11px] text-white/60">{hint}</div>
      </div>

      <div className="flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-white/10"
              aria-label="Filters"
            >
              <Filter className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="text-xs">Filters (UI stub for now)</TooltipContent>
        </Tooltip>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 gap-2 px-2 text-xs hover:bg-white/10"
            >
              <ArrowUpDown className="h-4 w-4" />
              <span className="hidden sm:inline">
                {String(sort.key)} ({sort.dir})
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            {SORTS.map((s) => (
              <DropdownMenuItem
                key={s.label}
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

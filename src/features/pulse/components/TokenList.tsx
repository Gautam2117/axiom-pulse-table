"use client";

import * as React from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import type { PulseColumn, TokenRow } from "@/features/pulse/types";
import { useSortedTokens } from "@/features/pulse/hooks/useSortedTokens";
import { TokenRowItem } from "@/features/pulse/components/TokenRowItem";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/lib/redux-hooks";
import { seedPrices } from "@/features/prices/pricesSlice";
import { usePriceStream } from "@/features/prices/hooks/usePriceStream";

const ROW_H = 550; // Significantly increased for no overlap

function SkeletonRow() {
  return (
    <div className="relative h-[550px] px-7 py-10 pb-16">
      <div className="flex items-start gap-6">
        <div className="h-16 w-16 rounded-2xl bg-white/10" />
        <div className="min-w-0 flex-1">
          <div className="h-4 w-52 rounded bg-white/10" />
          <div className="mt-6 h-3 w-40 rounded bg-white/10" />
          <div className="mt-12 grid grid-cols-2 gap-4 gap-y-6">
            <div className="h-[76px] rounded-xl bg-white/10" />
            <div className="h-[76px] rounded-xl bg-white/10" />
            <div className="h-[76px] rounded-xl bg-white/10" />
            <div className="h-[76px] rounded-xl bg-white/10" />
            <div className="h-[76px] col-span-2 rounded-xl bg-white/10" />
          </div>
        </div>
        <div className="h-10 w-10 rounded bg-white/10" />
      </div>

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-1/2 top-0 h-full w-1/2 animate-shimmer bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      </div>
    </div>
  );
}

export function TokenList({
  column,
  items,
  isLoading,
  isError,
  errorMessage,
  onRetry,
}: {
  column: PulseColumn;
  items: TokenRow[];
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
  onRetry: () => void;
}) {
  const parentRef = React.useRef<HTMLDivElement | null>(null);
  const dispatch = useAppDispatch();

  // Stable arrays (prevents effects from firing every render)
  const ids = React.useMemo(() => items.map((t) => t.id), [items]);
  const seedPayload = React.useMemo(
    () => items.map((t) => ({ id: t.id, price: t.price })),
    [items]
  );

  const seededKeyRef = React.useRef<string>("");

  React.useEffect(() => {
    if (isLoading || !items.length) return;

    const key = ids.join("|");
    if (key === seededKeyRef.current) return;

    seededKeyRef.current = key;
    dispatch(seedPrices(seedPayload));
  }, [dispatch, isLoading, items.length, ids, seedPayload]);

  usePriceStream(isLoading ? [] : ids);

  const sorted = useSortedTokens(column, items);

  // eslint-disable-next-line react-hooks/incompatible-library
  const virtual = useVirtualizer({
    count: isLoading ? 10 : sorted.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_H,
    overscan: 8,
  });


  if (isError) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
        <div className="text-sm font-semibold">Could not load</div>
        <div className="text-xs text-white/60">{errorMessage}</div>
        <Button variant="secondary" onClick={onRetry}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div ref={parentRef} className="h-full overflow-auto">
      <div
        className="relative w-full"
        style={{ height: `${virtual.getTotalSize()}px` }}
      >
        {virtual.getVirtualItems().map((v) => {
          const style: React.CSSProperties = {
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            transform: `translateY(${v.start}px)`,
          };

          if (isLoading) {
            return (
              <div key={v.key} style={style} className="border-b border-white/10">
                <SkeletonRow />
              </div>
            );
          }

          const token = sorted[v.index];
          return (
            <div key={v.key} style={style} className="border-b border-white/10">
              <TokenRowItem token={token} column={column} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
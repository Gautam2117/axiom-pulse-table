"use client";

import * as React from "react";
import type { PulseColumn, TokenRow } from "@/features/pulse/types";
import { hashColor } from "@/features/pulse/utils/color";
import { formatAge, formatPrice, formatUSD } from "@/features/pulse/utils/format";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Bolt, ExternalLink, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/lib/redux-hooks";
import { openTokenModal } from "@/features/pulse/pulseSlice";
import { TokenDetailsDialog } from "@/features/pulse/components/TokenDetailsDialog";

function Stat({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="min-w-0 rounded-xl border border-white/5 bg-white/[0.03] px-4 py-5">
      <div className="text-[12px] leading-4 text-white/45">{label}</div>
      <div
        className={[
          "mt-4 text-[15px] font-semibold leading-5 tabular-nums",
          valueClassName ?? "",
        ].join(" ")}
      >
        {value}
      </div>
    </div>
  );
}

export const TokenRowItem = React.memo(function TokenRowItem({
  token,
  column,
}: {
  token: TokenRow;
  column: PulseColumn;
}) {
  const dispatch = useAppDispatch();
  const accent = React.useMemo(() => hashColor(token.id), [token.id]);

  // Live price from Redux (only this row re-renders when its price changes)
  const livePrice = useAppSelector((s) => s.prices.byId[token.id]?.price);
  const price = livePrice ?? token.price;

  // Flash state (green on up, red on down)
  const prevPriceRef = React.useRef<number>(price);
  const [flash, setFlash] = React.useState<"up" | "down" | null>(null);

  React.useEffect(() => {
    const prev = prevPriceRef.current;
    if (price === prev) return;

    setFlash(price > prev ? "up" : "down");
    prevPriceRef.current = price;

    const t = window.setTimeout(() => setFlash(null), 520);
    return () => window.clearTimeout(t);
  }, [price]);

  const open = React.useCallback(() => {
    dispatch(openTokenModal(token.id));
  }, [dispatch, token.id]);

  return (
    <>
      {/* CHANGED: <button> -> <div role="button"> to avoid nested buttons */}
      <div
        role="button"
        tabIndex={0}
        onClick={open}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            open();
          }
        }}
        className={[
          "group w-full text-left outline-none",
          "px-7 py-10 pb-20",
          "min-h-[550px]", // Significantly increased for no overlap
          "transition-colors hover:bg-white/[0.06] focus-visible:ring-2 focus-visible:ring-white/20",
          flash === "up" ? "bg-emerald-500/5" : "",
          flash === "down" ? "bg-rose-500/5" : "",
        ].join(" ")}
        aria-label={`Open ${token.name} details`}
      >
        <div className="grid items-start gap-6 grid-cols-[64px_minmax(0,1fr)_auto]">
          {/* avatar */}
          <div
            className="grid h-16 w-16 place-items-center rounded-2xl"
            style={{
              background: `linear-gradient(135deg, ${accent}, rgba(255,255,255,0.10))`,
            }}
          >
            <span className="text-[20px] font-bold">
              {token.symbol.slice(0, 1)}
            </span>
          </div>

          {/* content */}
          <div className="min-w-0">
            {/* top row */}
            <div className="flex min-w-0 items-center gap-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="min-w-0 flex-1 truncate text-[16px] font-semibold leading-6">
                    {token.name}
                  </div>
                </TooltipTrigger>
                <TooltipContent className="text-xs">{token.name}</TooltipContent>
              </Tooltip>

              <span className="shrink-0 rounded-lg bg-white/10 px-3 py-1 text-[12px] text-white/70">
                {token.symbol}
              </span>

              <span className="shrink-0 text-[12px] text-white/50">
                {formatAge(token.ageMins)}
              </span>
            </div>

            {/* meta row */}
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] leading-5 text-white/60">
              <span>Top10 {token.top10Pct.toFixed(0)}%</span>
              <span className="text-white/20">•</span>
              <span>Dev {token.devHoldPct.toFixed(0)}%</span>
              <span className="text-white/20">•</span>
              <span>Snipers {token.snipersPct.toFixed(0)}%</span>
            </div>

            {/* stats - 2 columns with much more vertical spacing */}
            <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-6">
              <Stat
                label="Price"
                value={formatPrice(price)}
                valueClassName={[
                  "transition-colors duration-300",
                  flash === "up" ? "text-emerald-300" : "",
                  flash === "down" ? "text-rose-300" : "",
                ].join(" ")}
              />
              <Stat label="MCap" value={formatUSD(token.marketCap)} />
              <Stat label="Liq" value={formatUSD(token.liquidity)} />
              <Stat label="Vol" value={formatUSD(token.volume)} />
              <div className="col-span-2">
                <Stat label="Txns" value={token.txns.toLocaleString()} />
              </div>
            </div>
          </div>

          {/* actions */}
          <div className="flex items-center gap-2 pt-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 hover:bg-white/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    toast.success("Quick Buy clicked", {
                      description: `${token.symbol} (${column})`,
                    });
                  }}
                  aria-label="Quick buy"
                >
                  <Bolt className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="text-xs">Quick Buy</TooltipContent>
            </Tooltip>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 hover:bg-white/10"
                  onClick={(e) => e.stopPropagation()}
                  aria-label="More actions"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </PopoverTrigger>

              <PopoverContent
                align="end"
                className="w-56 bg-[#0b0f14] text-white border-white/10"
                onOpenAutoFocus={(e) => e.preventDefault()}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-xs font-semibold">{token.symbol}</div>
                <div className="mt-3 grid gap-2">
                  <Button
                    variant="secondary"
                    className="justify-start"
                    onClick={() => toast("Copied CA (mock)")}
                  >
                    Copy CA (mock)
                  </Button>

                  <Button
                    variant="secondary"
                    className="justify-start"
                    onClick={() => toast("Opened external link (mock)")}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Open on Explorer
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      <TokenDetailsDialog token={token} />
    </>
  );
});

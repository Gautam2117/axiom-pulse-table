"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { TokenRow } from "@/features/pulse/types";
import { formatPrice, formatUSD } from "@/features/pulse/utils/format";
import { useAppDispatch, useAppSelector } from "@/lib/redux-hooks";
import { closeTokenModal } from "@/features/pulse/pulseSlice";

export function TokenDetailsDialog({ token }: { token: TokenRow }) {
  const selectedId = useAppSelector((s) => s.pulse.selectedTokenId);
  const open = selectedId === token.id;
  const dispatch = useAppDispatch();

  return (
    <Dialog open={open} onOpenChange={(v) => (!v ? dispatch(closeTokenModal()) : null)}>
      <DialogContent className="max-w-[520px] bg-[#0b0f14] text-white border-white/10">
        <DialogHeader>
          <DialogTitle className="text-base">
            {token.name} <span className="text-white/60">({token.symbol})</span>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-lg border border-white/10 bg-white/5 p-3">
            <div className="text-[11px] text-white/60">Price</div>
            <div className="mt-1 text-lg font-semibold">{formatPrice(token.price)}</div>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 p-3">
            <div className="text-[11px] text-white/60">Market Cap</div>
            <div className="mt-1 text-lg font-semibold">{formatUSD(token.marketCap)}</div>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 p-3">
            <div className="text-[11px] text-white/60">Liquidity</div>
            <div className="mt-1 text-lg font-semibold">{formatUSD(token.liquidity)}</div>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 p-3">
            <div className="text-[11px] text-white/60">Volume</div>
            <div className="mt-1 text-lg font-semibold">{formatUSD(token.volume)}</div>
          </div>
        </div>

        <div className="mt-3 rounded-lg border border-white/10 bg-white/5 p-3">
          <div className="text-[11px] text-white/60">Risk distribution</div>
          <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-white/80">
            <div>Top 10: {token.top10Pct.toFixed(0)}%</div>
            <div>Dev: {token.devHoldPct.toFixed(0)}%</div>
            <div>Snipers: {token.snipersPct.toFixed(0)}%</div>
            <div>Insiders: {token.insidersPct.toFixed(0)}%</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

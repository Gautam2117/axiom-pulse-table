import type { PulseColumn as Col } from "@/features/pulse/pulseSlice";

export type PulseColumn = Col;

export type TokenRow = {
  id: string;
  name: string;
  symbol: string;
  price: number;
  marketCap: number;
  liquidity: number;
  volume: number;
  txns: number;
  ageMins: number;
  holders: number;
  top10Pct: number;
  devHoldPct: number;
  snipersPct: number;
  insidersPct: number;
};

export type ColumnResponse = { column: PulseColumn; items: TokenRow[] };

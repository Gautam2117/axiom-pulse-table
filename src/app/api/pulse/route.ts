import { NextResponse } from "next/server";

export type PulseColumn = "newPairs" | "finalStretch" | "migrated";

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

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeToken(seed: number, ageMin: number): TokenRow {
  const rnd = mulberry32(seed);
  const pick = (a: number, b: number) => a + (b - a) * rnd();
  const id = `tok_${seed.toString(16)}`;

  const syll = ["zo", "mi", "ra", "ke", "lu", "fi", "no", "xa", "pe", "tri"];
  const name =
    syll[Math.floor(rnd() * syll.length)].toUpperCase() +
    syll[Math.floor(rnd() * syll.length)] +
    " " +
    ["Coin", "AI", "Cat", "Dog", "Lab", "DAO", "Pump", "Tech"][Math.floor(rnd() * 8)];
  const symbol =
    (syll[Math.floor(rnd() * syll.length)] + syll[Math.floor(rnd() * syll.length)])
      .toUpperCase()
      .slice(0, 6);

  const marketCap = pick(8_000, 2_500_000);
  const liquidity = pick(2_000, 350_000);
  const volume = pick(1_000, 1_800_000);
  const txns = Math.floor(pick(20, 12_000));
  const price = pick(0.0000001, 2.5);

  const holders = Math.floor(pick(15, 16_000));
  const top10Pct = pick(8, 85);
  const devHoldPct = pick(0, 25);
  const snipersPct = pick(0, 55);
  const insidersPct = pick(0, 40);

  return {
    id,
    name,
    symbol,
    price,
    marketCap,
    liquidity,
    volume,
    txns,
    ageMins: ageMin,
    holders,
    top10Pct,
    devHoldPct,
    snipersPct,
    insidersPct,
  };
}

function makeList(column: PulseColumn): TokenRow[] {
  const baseSeed = column === "newPairs" ? 101 : column === "finalStretch" ? 202 : 303;
  const count = column === "newPairs" ? 70 : column === "finalStretch" ? 60 : 60;

  const ages =
    column === "newPairs"
      ? () => Math.floor(Math.random() * 45) + 1
      : column === "finalStretch"
      ? () => Math.floor(Math.random() * 240) + 30
      : () => Math.floor(Math.random() * 900) + 60;

  return Array.from({ length: count }).map((_, i) => makeToken(baseSeed + i * 17, ages()));
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const column = searchParams.get("column") as PulseColumn | null;

  // progressive loading: each column responds at different speeds
  const delay =
    column === "newPairs" ? 250 : column === "finalStretch" ? 650 : column === "migrated" ? 900 : 450;
  await sleep(delay);

  // optional error simulation for testing error boundaries
  if (searchParams.get("fail") === "1") {
    return NextResponse.json({ message: "Simulated API failure" }, { status: 500 });
  }

  if (column) return NextResponse.json({ column, items: makeList(column) });

  return NextResponse.json({
    newPairs: makeList("newPairs"),
    finalStretch: makeList("finalStretch"),
    migrated: makeList("migrated"),
  });
}

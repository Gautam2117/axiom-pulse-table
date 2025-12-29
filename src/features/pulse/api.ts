import type { ColumnResponse, PulseColumn } from "@/features/pulse/types";

export async function fetchPulseColumn(column: PulseColumn): Promise<ColumnResponse> {
  const res = await fetch(`/api/pulse?column=${column}`, { cache: "no-store" });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Failed to load ${column}`);
  }
  return res.json() as Promise<ColumnResponse>;
}

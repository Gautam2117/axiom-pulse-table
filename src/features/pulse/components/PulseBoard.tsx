"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { PulseColumn } from "@/features/pulse/types";
import { useAppDispatch, useAppSelector } from "@/lib/redux-hooks";
import { setActiveMobileColumn } from "@/features/pulse/pulseSlice";
import { PulseColumnPanel } from "@/features/pulse/components/PulseColumnPanel";

const COLUMNS: Array<{ key: PulseColumn; label: string; hint: string }> = [
  { key: "newPairs", label: "New Pairs", hint: "Just created pairs" },
  { key: "finalStretch", label: "Final Stretch", hint: "Near migration" },
  { key: "migrated", label: "Migrated", hint: "Recently migrated" },
];

export function PulseBoard() {
  const active = useAppSelector((s) => s.pulse.activeMobileColumn);
  const dispatch = useAppDispatch();

  return (
    <section className="mt-6">
      {/* Mobile */}
      <div className="lg:hidden">
        <Tabs
          value={active}
          onValueChange={(v) => dispatch(setActiveMobileColumn(v as PulseColumn))}
        >
          <TabsList className="w-full bg-white/5">
            {COLUMNS.map((c) => (
              <TabsTrigger
                key={c.key}
                value={c.key}
                className="w-full data-[state=active]:bg-white/10"
              >
                {c.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {COLUMNS.map((c) => (
            <TabsContent key={c.key} value={c.key} className="mt-4">
              <PulseColumnPanel column={c.key} title={c.label} hint={c.hint} />
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Desktop */}
      <div className="hidden lg:grid lg:grid-cols-3 lg:gap-6 xl:gap-7">
        {COLUMNS.map((c) => (
          <PulseColumnPanel
            key={c.key}
            column={c.key}
            title={c.label}
            hint={c.hint}
          />
        ))}
      </div>
    </section>
  );
}

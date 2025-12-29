"use client";

import * as React from "react";
import { useStore } from "react-redux";
import type { RootState, AppDispatch } from "@/lib/store";
import { applyPriceDeltas } from "@/features/prices/pricesSlice";
import { MockPriceSocket } from "@/features/prices/mockPriceSocket";

const socket = new MockPriceSocket();
let started = false;

export function usePriceStream(ids: string[]) {
  const store = useStore<{ getState: () => RootState; dispatch: AppDispatch }>();
  const prevRef = React.useRef<Set<string>>(new Set());

  React.useEffect(() => {
    if (started) return;
    started = true;

    socket.connect();

    socket.addEventListener("message", (e) => {
      try {
        const raw = (e as MessageEvent).data as string;
        const msg = JSON.parse(raw) as {
          type: "tick";
          ts: number;
          updates: Array<{ id: string; pctDelta: number }>;
        };

        if (msg.type === "tick") {
          store.dispatch(applyPriceDeltas({ ts: msg.ts, updates: msg.updates }));
        }
      } catch {
        // ignore
      }
    });
  }, [store]);

  React.useEffect(() => {
    const next = new Set(ids);
    const prev = prevRef.current;

    const add: string[] = [];
    const remove: string[] = [];

    for (const id of next) if (!prev.has(id)) add.push(id);
    for (const id of prev) if (!next.has(id)) remove.push(id);

    if (add.length) socket.subscribe(add);
    if (remove.length) socket.unsubscribe(remove);

    prevRef.current = next;

    return () => {
      socket.unsubscribe(Array.from(next));
      prevRef.current = new Set();
    };
  }, [ids]);
}

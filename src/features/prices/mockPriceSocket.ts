type TickPayload = { type: "tick"; ts: number; updates: Array<{ id: string; pctDelta: number }> };

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export class MockPriceSocket extends EventTarget {
  private timer: ReturnType<typeof setInterval> | null = null;
  private subs = new Set<string>();

  connect() {
    if (this.timer) return;

    this.timer = setInterval(() => {
      if (this.subs.size === 0) return;

      const ids = Array.from(this.subs);
      const batch = Math.floor(rand(1, 5)); // update 1-4 tokens per tick

      const updates: TickPayload["updates"] = [];
      for (let i = 0; i < batch; i++) {
        const id = ids[Math.floor(Math.random() * ids.length)];
        // small delta for smooth flashing
        const pctDelta = rand(-0.0045, 0.0045);
        updates.push({ id, pctDelta });
      }

      const msg: TickPayload = { type: "tick", ts: Date.now(), updates };
      this.dispatchEvent(new MessageEvent("message", { data: JSON.stringify(msg) }));
    }, 450); // ~2 ticks/sec like a stream
  }

  subscribe(ids: string[]) {
    for (const id of ids) this.subs.add(id);
  }

  unsubscribe(ids: string[]) {
    for (const id of ids) this.subs.delete(id);
  }
}

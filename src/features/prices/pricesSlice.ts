import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type PriceEntry = { price: number; lastUpdated: number };

type PricesState = {
  byId: Record<string, PriceEntry>;
};

const initialState: PricesState = { byId: {} };

export const pricesSlice = createSlice({
  name: "prices",
  initialState,
  reducers: {
    seedPrices: (state, action: PayloadAction<Array<{ id: string; price: number }>>) => {
      const ts = Date.now();
      for (const t of action.payload) {
        if (!state.byId[t.id]) state.byId[t.id] = { price: t.price, lastUpdated: ts };
      }
    },

    applyPriceDeltas: (
      state,
      action: PayloadAction<{ ts: number; updates: Array<{ id: string; pctDelta: number }> }>
    ) => {
      const { ts, updates } = action.payload;
      for (const u of updates) {
        const cur = state.byId[u.id];
        if (!cur) continue;

        const next = cur.price * (1 + u.pctDelta);
        state.byId[u.id] = {
          price: Math.max(0, next),
          lastUpdated: ts,
        };
      }
    },
  },
});

export const { seedPrices, applyPriceDeltas } = pricesSlice.actions;
export default pricesSlice.reducer;

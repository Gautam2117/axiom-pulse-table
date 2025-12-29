import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type PulseColumn = "newPairs" | "finalStretch" | "migrated";
export type SortDir = "asc" | "desc";

export type PulseSortKey =
  | "marketCap"
  | "volume"
  | "liquidity"
  | "txns"
  | "age"
  | "holders";

type PulseState = {
  // Desktop shows 3 columns. Mobile will use this to show 1 column at a time.
  activeMobileColumn: PulseColumn;

  // Sorting is per column (matches “complex state” expectation)
  sortBy: Record<PulseColumn, { key: PulseSortKey; dir: SortDir }>;

  // Used for modal open
  selectedTokenId: string | null;
};

const initialState: PulseState = {
  activeMobileColumn: "newPairs",
  sortBy: {
    newPairs: { key: "age", dir: "asc" },
    finalStretch: { key: "volume", dir: "desc" },
    migrated: { key: "volume", dir: "desc" },
  },
  selectedTokenId: null,
};

const pulseSlice = createSlice({
  name: "pulse",
  initialState,
  reducers: {
    setActiveMobileColumn(state, action: PayloadAction<PulseColumn>) {
      state.activeMobileColumn = action.payload;
    },
    setSort(
      state,
      action: PayloadAction<{ column: PulseColumn; key: PulseSortKey }>
    ) {
      const { column, key } = action.payload;
      const current = state.sortBy[column];
      const nextDir: SortDir =
        current.key === key ? (current.dir === "asc" ? "desc" : "asc") : "desc";
      state.sortBy[column] = { key, dir: nextDir };
    },
    openTokenModal(state, action: PayloadAction<string>) {
      state.selectedTokenId = action.payload;
    },
    closeTokenModal(state) {
      state.selectedTokenId = null;
    },
  },
});

export const { setActiveMobileColumn, setSort, openTokenModal, closeTokenModal } =
  pulseSlice.actions;

export default pulseSlice.reducer;

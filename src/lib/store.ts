import { configureStore } from "@reduxjs/toolkit";
import pulseReducer from "@/features/pulse/pulseSlice";
import pricesReducer from "@/features/prices/pricesSlice";

export const store = configureStore({
  reducer: {
    pulse: pulseReducer,
    prices: pricesReducer,
  },
  middleware: (getDefault) =>
    getDefault({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

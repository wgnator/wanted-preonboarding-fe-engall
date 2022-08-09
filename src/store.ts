import { configureStore } from "@reduxjs/toolkit";
import timeZoneReducer from "./reducers/timeZoneReducer";

export const store = configureStore({
  reducer: {
    timeZone: timeZoneReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

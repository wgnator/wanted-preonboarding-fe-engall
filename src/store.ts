import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "./reducers/loginReducer";
import timeZoneReducer from "./reducers/timeZoneReducer";

export const store = configureStore({
  reducer: {
    timeZone: timeZoneReducer,
    login: loginReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

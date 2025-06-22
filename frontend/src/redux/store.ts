import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/auth.slice";

const store = configureStore({
  reducer: {
    authSlice: authSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;

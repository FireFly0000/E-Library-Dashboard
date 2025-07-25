import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import authSlice from "./slices/auth.slice";
import bookSlice from "./slices/books.slice";
import { bookApi } from "@/services/bookApis";
import { authorApi } from "@/services/authorApis";

const store = configureStore({
  reducer: {
    authSlice: authSlice,
    bookSlice: bookSlice,
    [bookApi.reducerPath]: bookApi.reducer,
    [authorApi.reducerPath]: authorApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(bookApi.middleware, authorApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;

import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import authSlice from "./slices/auth.slice";
import bookSlice from "./slices/books.slice";
import userSlice from "./slices/user.slice";
import { bookApi } from "@/services/bookApis";
import { authorApi } from "@/services/authorApis";
import { userApi } from "@/services/userApis";

const store = configureStore({
  reducer: {
    authSlice: authSlice,
    bookSlice: bookSlice,
    userSlice: userSlice,
    [bookApi.reducerPath]: bookApi.reducer,
    [authorApi.reducerPath]: authorApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(bookApi.middleware, authorApi.middleware, userApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;

import { configureStore } from "@reduxjs/toolkit";
import todos from "../features/todos/todoSlice";
import auth from "../features/auth/authSlice";

export const store = configureStore({
  reducer: {
    todos,
    auth,
  },
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './slices/theme.slice';
import taskApi from "./slices/search.slice.ts";
export const store = configureStore({
  reducer: {
    theme: themeReducer, 
    [taskApi.reducerPath]: taskApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(taskApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
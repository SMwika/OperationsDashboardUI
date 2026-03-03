import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { commonApi } from "./common/common.api";
import { commonReducer } from "./common/common.slice.ts";
import { dashboardReducer } from "./dashboard/dashboard.slice.ts";
import { dashboardApi } from "./dashboard/dashboard.api.ts";

export const store = configureStore({
  reducer: {
    [commonApi.reducerPath]: commonApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    common: commonReducer,
    dashboard: dashboardReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      commonApi.middleware,
      dashboardApi.middleware,
    ),
});

setupListeners(store.dispatch);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

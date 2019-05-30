import { IRootReducers } from "../reducers/root.reducers";

export const getCurrentRoute = (state: IRootReducers) =>
  state.page.currentRoute;

export const getPageError = (state: IRootReducers) => state.page.error;

export const getPageIsLoading = (state: IRootReducers) => state.page.isLoading;

export const hasNewVersion = (state: IRootReducers) => state.page.hasNewVersion;

export const isInInstalledApp = (state: IRootReducers) =>
  state.page.isInInstalledApp;

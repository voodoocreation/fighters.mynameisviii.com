import { TStoreState } from "../reducers/root.reducers";

export const getAppError = (state: TStoreState) => state.app.error;

export const isLoadingApp = (state: TStoreState) => state.app.isLoading;

export const hasNewVersion = (state: TStoreState) => state.app.hasNewVersion;

export const isInInstalledApp = (state: TStoreState) =>
  state.app.isInInstalledApp;

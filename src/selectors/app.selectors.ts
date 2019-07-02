import { IStoreState } from "../reducers/root.reducers";

export const getCurrentRoute = (state: IStoreState) => state.app.currentRoute;

export const getAppError = (state: IStoreState) => state.app.error;

export const isLoadingApp = (state: IStoreState) => state.app.isLoading;

export const hasNewVersion = (state: IStoreState) => state.app.hasNewVersion;

export const isInInstalledApp = (state: IStoreState) =>
  state.app.isInInstalledApp;

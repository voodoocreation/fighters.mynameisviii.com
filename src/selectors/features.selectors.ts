import { IRootReducers } from "../reducers/root.reducers";

export const getFeatures = (state: IRootReducers) => state.features.items;

export const hasFeature = (state: IRootReducers, feature: string) =>
  getFeatures(state).includes(feature);

import { IStoreState } from "../reducers/root.reducers";

export const getFeatures = (state: IStoreState) => state.features.items;

export const hasFeature = (state: IStoreState, feature: string) =>
  getFeatures(state).includes(feature);

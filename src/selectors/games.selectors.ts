import { createSelector } from "reselect";

import { IStoreState } from "../reducers/root.reducers";

export const getGames = (state: IStoreState) => state.games.items;

export const getCurrentGameSlug = (state: IStoreState) =>
  state.games.currentSlug;

export const getCurrentGame = createSelector(
  getGames,
  getCurrentGameSlug,
  (games, slug) => games.find(game => game.slug === slug)
);

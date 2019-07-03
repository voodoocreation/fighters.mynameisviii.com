import { createSelector } from "reselect";

import { TStoreState } from "../reducers/root.reducers";

export const getGames = (state: TStoreState) => state.games.items;

export const getCurrentGameSlug = (state: TStoreState) =>
  state.games.currentSlug;

export const getCurrentGame = createSelector(
  getGames,
  getCurrentGameSlug,
  (games, slug) => games.find(game => game.slug === slug)
);

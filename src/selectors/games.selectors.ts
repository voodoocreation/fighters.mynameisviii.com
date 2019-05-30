import { createSelector } from "reselect";

import { IRootReducers } from "../reducers/root.reducers";

export const getGames = (state: IRootReducers) => state.games.items;

export const getCurrentGameSlug = (state: IRootReducers) =>
  state.games.currentSlug;

export const getCurrentGame = createSelector(
  getGames,
  getCurrentGameSlug,
  (games, slug) => games.find(game => game.slug === slug)
);

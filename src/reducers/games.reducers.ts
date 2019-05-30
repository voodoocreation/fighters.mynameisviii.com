import { reducerWithInitialState } from "typescript-fsa-reducers";

import items from "../data/games";
import { IGame } from "../models/game.models";

import * as actions from "../actions/root.actions";

export interface IGamesReducers {
  currentSlug: string;
  items: IGame[];
}

export const initialState: IGamesReducers = {
  currentSlug: "",
  items
};

export default reducerWithInitialState(initialState)
  .case(actions.setCurrentGameSlug, (state, payload) => ({
    ...state,
    currentSlug: payload
  }))
  .case(actions.changeRoute.started, state => ({
    ...state,
    currentSlug: ""
  }));

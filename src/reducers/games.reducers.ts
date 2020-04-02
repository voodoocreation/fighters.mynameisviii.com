import { reducerWithInitialState } from "typescript-fsa-reducers";

import * as actions from "../actions/root.actions";
import { IGame } from "../models/game.models";

export interface IState {
  currentSlug: string;
  items: IGame[];
}

export const initialState: IState = {
  currentSlug: "",
  items: [],
};

export default reducerWithInitialState(initialState)
  .case(actions.initApp.started, (state, payload) => ({
    ...state,
    items: payload.games ? payload.games : state.items,
  }))

  .case(actions.setCurrentGameSlug, (state, payload) => ({
    ...state,
    currentSlug: payload,
  }))

  .case(actions.changeRoute.started, (state) => ({
    ...state,
    currentSlug: "",
  }));

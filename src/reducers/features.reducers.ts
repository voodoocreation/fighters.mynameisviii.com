import { reducerWithInitialState } from "typescript-fsa-reducers";

import * as actions from "../actions/root.actions";

export interface IFeaturesReducers {
  items: string[];
}

export const initialState: IFeaturesReducers = {
  items: []
};

export default reducerWithInitialState(initialState)
  .case(actions.addFeatures, (state, payload) => ({
    ...state,
    items: [
      ...state.items,
      ...(typeof payload === "string"
        ? [payload].filter(item => !state.items.includes(item))
        : payload.filter(item => !state.items.includes(item)))
    ]
  }))

  .case(actions.removeFeatures, (state, payload) => ({
    ...state,
    items: state.items.filter(
      item => item !== payload && !payload.includes(item)
    )
  }));

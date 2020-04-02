import { combineReducers } from "redux";

import app, { initialState as appInitialState } from "./app.reducers";
import features, {
  initialState as featuresInitialState,
} from "./features.reducers";
import games, { initialState as gamesInitialState } from "./games.reducers";
import intl, { initialState as intlInitialState } from "./intl.reducers";

export const initialState = {
  app: appInitialState,
  features: featuresInitialState,
  games: gamesInitialState,
  intl: intlInitialState,
};

const rootReducer = combineReducers({
  app,
  features,
  games,
  intl,
});

export default rootReducer;

export type TStoreState = typeof initialState;

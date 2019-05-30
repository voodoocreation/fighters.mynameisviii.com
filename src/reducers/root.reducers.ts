import { combineReducers } from "redux";

import features, {
  IFeaturesReducers,
  initialState as featuresInitialState
} from "./features.reducers";
import games, {
  IGamesReducers,
  initialState as gamesInitialState
} from "./games.reducers";
import page, {
  initialState as pageInitialState,
  IPageReducers
} from "./page.reducers";

export interface IRootReducers {
  features: IFeaturesReducers;
  games: IGamesReducers;
  page: IPageReducers;
}

const rootReducer = combineReducers({
  features,
  games,
  page
});

export default rootReducer;

export const initialState = {
  features: featuresInitialState,
  games: gamesInitialState,
  page: pageInitialState
};

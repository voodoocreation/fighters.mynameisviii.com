import { IntlState } from "react-intl-redux";
import { combineReducers } from "redux";

import app, {
  initialState as appInitialState,
  IState as IAppState
} from "./app.reducers";
import features, {
  initialState as featuresInitialState,
  IState as IFeaturesState
} from "./features.reducers";
import games, {
  initialState as gamesInitialState,
  IState as IGamesState
} from "./games.reducers";
import intl, { initialState as intlInitialState } from "./intl.reducers";

export interface IStoreState {
  app: IAppState;
  features: IFeaturesState;
  games: IGamesState;
  intl: IntlState;
}

const rootReducer = combineReducers({
  app,
  features,
  games,
  intl
});

export default rootReducer;

export const initialState: IStoreState = {
  app: appInitialState,
  features: featuresInitialState,
  games: gamesInitialState,
  intl: intlInitialState
};

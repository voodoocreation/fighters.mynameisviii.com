import actionCreatorFactory from "typescript-fsa";

import { IGame } from "../models/root.models";

const createAction = actionCreatorFactory("APP");

export const initApp = createAction.async<
  {
    games?: IGame[];
    locale?: string;
  },
  {}
>("INIT");

export const setCurrentRoute = createAction<string>("SET_CURRENT_ROUTE");

export const changeRoute = createAction.async<string, {}>("CHANGE_ROUTE");

export const setHasNewVersion = createAction<boolean>("SET_HAS_NEW_VERSION");

export const setIsInInstalledApp = createAction<boolean>(
  "SET_IS_IN_INSTALLED_APP"
);

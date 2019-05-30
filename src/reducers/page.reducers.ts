import { reducerWithInitialState } from "typescript-fsa-reducers";

import * as actions from "../actions/root.actions";
import { error, IError } from "../models/root.models";

export interface IPageReducers {
  currentRoute: string | undefined;
  error: IError | undefined;
  hasNewVersion: boolean;
  isInInstalledApp: boolean;
  isLoading: boolean;
  transitioningTo: string | undefined;
}

export const initialState: IPageReducers = {
  currentRoute: undefined,
  error: undefined,
  hasNewVersion: false,
  isInInstalledApp: false,
  isLoading: false,
  transitioningTo: undefined
};

export default reducerWithInitialState(initialState)
  .case(actions.setCurrentRoute, (state, payload) => ({
    ...state,
    currentRoute: payload
  }))

  .case(actions.changeRoute.started, (state, payload) => ({
    ...state,
    error: undefined,
    isLoading: true,
    transitioningTo: payload
  }))

  .case(actions.changeRoute.done, (state, { params }) => ({
    ...state,
    currentRoute: params,
    isLoading: false,
    transitioningTo: undefined
  }))

  .case(actions.changeRoute.failed, (state, payload) => ({
    ...state,
    error: error(payload.error),
    isLoading: false,
    transitioningTo: undefined
  }))

  .case(actions.setHasNewVersion, (state, payload) => ({
    ...state,
    hasNewVersion: payload
  }))

  .case(actions.setIsInInstalledApp, (state, payload) => ({
    ...state,
    isInInstalledApp: payload
  }));

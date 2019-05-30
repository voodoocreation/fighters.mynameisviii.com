import actionCreatorFactory from "typescript-fsa";

const actionCreator = actionCreatorFactory("PAGE");

export const setCurrentRoute = actionCreator<string>("SET_CURRENT_ROUTE");

export const changeRoute = actionCreator.async<string, null>("CHANGE_ROUTE");

export const setHasNewVersion = actionCreator<boolean>("SET_HAS_NEW_VERSION");

export const setIsInInstalledApp = actionCreator<boolean>(
  "SET_IS_IN_INSTALLED_APP"
);

import actionCreatorFactory from "typescript-fsa";

const createAction = actionCreatorFactory("GAMES");

export const setCurrentGameSlug = createAction<string>("SET_CURRENT_SLUG");

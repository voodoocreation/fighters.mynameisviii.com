import actionCreatorFactory from "typescript-fsa";

const actionCreator = actionCreatorFactory("GAMES");

export const setCurrentGameSlug = actionCreator<string>("SET_CURRENT_SLUG");

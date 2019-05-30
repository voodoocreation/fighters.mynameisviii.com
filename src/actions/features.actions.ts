import actionCreatorFactory from "typescript-fsa";

const actionCreator = actionCreatorFactory("FEATURES");

type TPayload = string | string[];

export const addFeatures = actionCreator<TPayload>("ADD");

export const removeFeatures = actionCreator<TPayload>("REMOVE");

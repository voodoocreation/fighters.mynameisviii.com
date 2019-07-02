import actionCreatorFactory from "typescript-fsa";

const createAction = actionCreatorFactory("FEATURES");

type TPayload = string | string[];

export const addFeatures = createAction<TPayload>("ADD");

export const removeFeatures = createAction<TPayload>("REMOVE");

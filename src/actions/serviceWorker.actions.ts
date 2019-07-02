import actionCreatorFactory from "typescript-fsa";

const createAction = actionCreatorFactory("SERVICE_WORKER");

export const receiveServiceWorkerMessage = createAction<IServiceWorkerMessage>(
  "RECEIVE_MESSAGE"
);

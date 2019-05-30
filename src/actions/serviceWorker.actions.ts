import actionCreatorFactory from "typescript-fsa";

const actionCreator = actionCreatorFactory("SERVICE_WORKER");

export const receiveServiceWorkerMessage = actionCreator<IServiceWorkerMessage>(
  "RECEIVE_MESSAGE"
);

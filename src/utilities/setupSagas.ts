import merge from "lodash.merge";
import { DeepPartial } from "redux";
import SagaTester from "redux-saga-tester";
import { ActionCreator, AnyAction } from "typescript-fsa";

import rootReducer, {
  initialState as rootInitialState,
  IRootReducers
} from "../reducers/root.reducers";
import rootSaga from "../sagas/root.sagas";
import {
  configureTestPorts,
  IPorts,
  ITestPorts
} from "../services/configurePorts";

export default (
  fromTestStore: DeepPartial<IRootReducers> = {},
  fromTestPorts: Partial<ITestPorts> = {}
) => {
  const initialState: IRootReducers = merge(
    {},
    rootInitialState,
    fromTestStore
  );
  const ports: unknown = configureTestPorts(fromTestPorts);

  const sagaTester = new SagaTester({
    initialState,
    reducers: rootReducer
  });
  sagaTester.start(rootSaga(ports as IPorts));

  return {
    dispatch: (action: AnyAction) => sagaTester.dispatch(action),
    filterAction: <AC extends ActionCreator<any>>(actionCreator: AC) =>
      sagaTester.getCalledActions().filter(actionCreator.match) as Array<
        ReturnType<AC>
      >,
    ports,
    sagaTester,
    store: () => sagaTester.getState() as IRootReducers
  };
};

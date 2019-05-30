import { call, takeLatest } from "redux-saga/effects";
import { Action } from "typescript-fsa";

import { IPorts } from "../services/configurePorts";

import * as actions from "../actions/root.actions";

export const trackAnalyticsEventSaga = (ports: IPorts) =>
  function*() {
    yield takeLatest(actions.trackEvent, function*(
      action: Action<IAnalyticsEvent>
    ) {
      yield call(ports.dataLayer.push, action.payload);
    });
  };

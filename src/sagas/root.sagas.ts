import { SagaIterator } from "redux-saga";
import { all, fork, ForkEffect } from "redux-saga/effects";

import { IPorts } from "../services/configurePorts";
import * as analytics from "./analytics.sagas";
import * as serviceWorker from "./serviceWorker.sagas";

const allSagas = {
  ...analytics,
  ...serviceWorker,
};

const mapSagas = (ports: IPorts) => {
  const mapped: ForkEffect[] = [];

  for (const saga of Object.values(allSagas)) {
    mapped.push(fork(saga(ports)));
  }

  return mapped;
};

export default function* (ports: IPorts): SagaIterator {
  yield all(mapSagas(ports));
}

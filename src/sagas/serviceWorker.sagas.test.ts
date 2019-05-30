import setupSagas from "../utilities/setupSagas";

import * as actions from "../actions/root.actions";

describe("[sagas] Service worker", () => {
  describe("takeLatest(actions.changeRoute.done)", () => {
    describe("when the service worker is available", () => {
      afterAll(() => {
        jest.clearAllMocks();
      });

      const newRoute = "/test";
      const { dispatch } = setupSagas();

      it("has a service worker in an 'activated' state", () => {
        const { state } = navigator.serviceWorker.controller as ServiceWorker;

        expect(navigator.serviceWorker).toBeDefined();
        expect(state).toBe("activated");
      });

      it("dispatches actions.changeRoute.done", () => {
        dispatch(actions.changeRoute.done({ params: newRoute, result: null }));
      });

      it("calls serviceWorker.postMessage with expected payload", () => {
        const { postMessage } = navigator.serviceWorker
          .controller as ServiceWorker;

        expect(postMessage).toHaveBeenCalledWith({
          payload: newRoute,
          type: "changeRoute"
        });
      });
    });

    describe("when the service worker isn't ready", () => {
      beforeAll(() => {
        // @ts-ignore-next-line
        navigator.serviceWorker.controller.state = "installing";
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      const newRoute = "/test";

      const { dispatch } = setupSagas();
      let isPassing = true;

      it("has a service worker in an 'installing' state", () => {
        const { state } = navigator.serviceWorker.controller as ServiceWorker;

        expect(navigator.serviceWorker).toBeDefined();
        expect(state).toBe("installing");
      });

      it("dispatches actions.changeRoute.done", () => {
        try {
          dispatch(
            actions.changeRoute.done({ params: newRoute, result: null })
          );
        } catch (error) {
          isPassing = false;
        }
      });

      it("doesn't throw an error", () => {
        expect(isPassing).toBe(true);
      });

      it("doesn't call serviceWorker.postMessage", () => {
        const { postMessage } = navigator.serviceWorker
          .controller as ServiceWorker;

        expect(postMessage).not.toHaveBeenCalled();
      });
    });

    describe("when the service worker doesn't exist", () => {
      beforeAll(() => {
        // @ts-ignore-next-line
        navigator.serviceWorker = undefined;
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      const { dispatch } = setupSagas();
      let isPassing = true;

      it("dispatches actions.changeRoute.done", () => {
        try {
          dispatch(actions.changeRoute.done({ params: "/test", result: null }));
        } catch (error) {
          isPassing = false;
        }
      });

      it("has no service worker available", () => {
        expect(navigator.serviceWorker).toBeUndefined();
      });

      it("fails silently without throwing an error", () => {
        expect(isPassing).toBe(true);
      });
    });
  });

  describe("takeLatest(actions.receiveServiceWorkerMessage)", () => {
    describe("when the service worker has activated", () => {
      const { dispatch, filterAction } = setupSagas();

      it("dispatches actions.receiveServiceWorkerMessage", () => {
        dispatch(
          actions.receiveServiceWorkerMessage({
            type: "serviceWorker.activate"
          })
        );
      });

      it("dispatches actions.setHasNewVersion", () => {
        const newVersionActions = filterAction(actions.setHasNewVersion);

        expect(newVersionActions).toHaveLength(1);
        expect(newVersionActions[0].payload).toEqual(true);
      });
    });
  });
});

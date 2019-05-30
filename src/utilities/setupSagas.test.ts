import setupSagas from "./setupSagas";

import * as actions from "../actions/root.actions";
import * as selectors from "../selectors/root.selectors";

describe("[utilities] Setup sagas", () => {
  describe("when setting up sagas for tests", () => {
    const tester = setupSagas();

    it("has all helper methods defined on the returned object", () => {
      expect(tester).toHaveProperty("dispatch");
      expect(tester).toHaveProperty("filterAction");
      expect(tester).toHaveProperty("ports");
      expect(tester).toHaveProperty("sagaTester");
      expect(tester).toHaveProperty("store");
    });

    it("dispatches actions correctly", () => {
      tester.dispatch(actions.setCurrentRoute("/"));
    });

    it("filters actions correctly", () => {
      const matchingActions = tester.filterAction(actions.setCurrentRoute);

      expect(matchingActions).toHaveLength(1);
      expect(matchingActions[0].payload).toBe("/");
    });

    it("gets the current store state correctly", () => {
      expect(selectors.getCurrentRoute(tester.store())).toBe("/");
    });
  });
});

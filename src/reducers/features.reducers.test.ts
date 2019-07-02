import reducer, { initialState, IState } from "./features.reducers";

import * as actions from "../actions/root.actions";

describe("[reducers] Features", () => {
  const feature1 = "has-test-feature-1";
  const feature2 = "has-test-feature-2";

  describe("actions.addFeatures", () => {
    describe("when the payload is a string", () => {
      let state1: IState;
      let state2: IState;

      it("dispatches actions.addFeatures", () => {
        state1 = reducer(initialState, actions.addFeatures(feature1));
      });

      it("reduces the feature into the store", () => {
        expect(state1.items).toEqual([feature1]);
      });

      it("dispatches actions.addFeatures again with the same payload", () => {
        state2 = reducer(state1, actions.addFeatures(feature1));
      });

      it("doesn't duplicate the feature in the store", () => {
        expect(state2.items).toEqual([feature1]);
      });
    });

    describe("when the payload is an array", () => {
      let state1: IState;
      let state2: IState;

      it("dispatches actions.addFeatures", () => {
        state1 = reducer(
          initialState,
          actions.addFeatures([feature1, feature2])
        );
      });

      it("reduces both features into the store", () => {
        expect(state1.items).toEqual([feature1, feature2]);
      });

      it("dispatches actions.addFeatures again with the same features", () => {
        state2 = reducer(state1, actions.addFeatures([feature2, feature1]));
      });

      it("doesn't duplicate the features in the store", () => {
        expect(state2.items).toEqual([feature1, feature2]);
      });
    });
  });

  describe("actions.removeFeatures", () => {
    describe("when the payload is a string", () => {
      let state: IState;

      it("dispatches actions.removeFeatures", () => {
        state = reducer(
          { items: [feature1] },
          actions.removeFeatures(feature1)
        );
      });

      it("removes the feature from the store", () => {
        expect(state.items).toEqual([]);
      });
    });

    describe("when the payload is an array", () => {
      let state: IState;

      it("dispatches actions.removeFeatures", () => {
        state = reducer(
          { items: [feature1, feature2] },
          actions.removeFeatures([feature2, feature1])
        );
      });

      it("removes both features from the store", () => {
        expect(state.items).toEqual([]);
      });
    });
  });
});

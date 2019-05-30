import reducer, { initialState } from "./games.reducers";

import * as actions from "../actions/root.actions";

describe("[reducers] Games", () => {
  it("reduces actions.setCurrentGameSlug correctly", () => {
    const slug = "mortal-kombat";
    const state = reducer(initialState, actions.setCurrentGameSlug(slug));

    expect(state.currentSlug).toEqual(slug);
  });

  it("reduces actions.changeRoute.started correctly", () => {
    const slug = "mortal-kombat";
    const state = reducer(
      {
        ...initialState,
        currentSlug: slug
      },
      actions.changeRoute.started("/")
    );

    expect(state.currentSlug).toBe("");
  });
});

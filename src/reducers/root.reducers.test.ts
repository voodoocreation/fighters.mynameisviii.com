import reducer, { initialState } from "./root.reducers";

describe("[reducers] Root", () => {
  it("combines all reducers correctly", () => {
    const state = reducer({} as any, { type: "NOTHING" });

    expect(state).toEqual(initialState);
  });
});

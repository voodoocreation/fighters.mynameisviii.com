import * as actions from "../actions/root.actions";
import { game } from "../models/root.models";
import reducer, { initialState } from "./games.reducers";

describe("[reducers] Games", () => {
  describe("actions.initApp.started", () => {
    const games = [game({ title: "Mortal Kombat" })];

    it("reduces correctly when `games` is defined", () => {
      const state = reducer(
        initialState,
        actions.initApp.started({
          games
        })
      );

      expect(state.items).toEqual(games);
    });

    it("reduces correctly when `games` isn't defined", () => {
      const state = reducer(
        {
          ...initialState,
          items: games
        },
        actions.initApp.started({})
      );

      expect(state.items).toEqual(games);
    });
  });

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

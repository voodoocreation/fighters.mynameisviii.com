import { game } from "../../../models/root.models";
import * as selectors from "../../../selectors/root.selectors";
import { createStore } from "../../../store/root.store";
import WrapperWithRedux from "../../../utilities/WrapperWithRedux";
import GameRoute from "./GameRoute";

const component = new WrapperWithRedux(GameRoute);

const testGame = game({
  title: "Test game",
});

describe("[routes] <GameRoute />", () => {
  it("is set up correctly by getInitialProps()", async () => {
    const store = createStore({
      games: {
        items: [testGame],
      },
    });

    await GameRoute.getInitialProps({
      query: { slug: testGame.slug },
      store,
    } as any);

    expect(selectors.getCurrentGameSlug(store.getState())).toBe(testGame.slug);
  });

  describe("when there's no current game", () => {
    const wrapper = component.mount();

    it("renders an <ErrorPage />", () => {
      expect(wrapper.find("ErrorPage")).toHaveLength(1);
    });
  });

  describe("when there is a current game", () => {
    const wrapper = component
      .withReduxState({
        games: {
          currentSlug: testGame.slug,
          items: [testGame],
        },
      })
      .mount();

    it("renders a <Game />", () => {
      expect(wrapper.find("Game")).toHaveLength(1);
    });

    it("adds the game-specific class to the body element", () => {
      expect(document.body.classList.contains(`Game--${testGame.slug}`)).toBe(
        true
      );
    });

    it("unmounts correctly", () => {
      wrapper.unmount();
    });

    it("removes the game-specific class from the body element", () => {
      expect(document.body.classList.contains(`Game--${testGame.slug}`)).toBe(
        false
      );
    });
  });
});

import { character, game } from "../../../models/root.models";
import WrapperWithIntl from "../../../utilities/WrapperWithIntl";
import GameListing from "./GameListing";

const testGame = game({
  characters: [
    character({
      name: "Test character 1",
    }),
    character({
      name: "Test character 2",
    }),
  ],
  imageUrl: "imageUrl",
  slug: "test-game",
  title: "Test Game",
});

const component = new WrapperWithIntl(GameListing).withDefaultProps({
  ...testGame,
  onClick: jest.fn(),
});

describe("[presentation] <GameListing />", () => {
  describe("when the listing isn't selected", () => {
    const wrapper = component.mount();

    beforeAll(() => {
      jest.clearAllMocks();
    });

    it("renders without the isSelected class", () => {
      expect(wrapper.find(".isSelected")).toHaveLength(0);
    });

    it("renders correct link route", () => {
      expect(wrapper.find("Link").prop("route")).toBe("/games/test-game");
    });

    describe("when clicking the listing", () => {
      it("clicks the link", () => {
        wrapper.find("Link").simulate("click");
      });

      it("calls the onClick prop", () => {
        expect(component.props.onClick).toHaveBeenCalledTimes(1);
      });
    });

    it("matches snapshot", () => {
      expect(wrapper.render()).toMatchSnapshot();
    });
  });

  describe("when the listing is selected", () => {
    const wrapper = component
      .withProps({
        isSelected: true,
      })
      .mount();

    beforeAll(() => {
      jest.clearAllMocks();
    });

    it("renders with the isSelected class", () => {
      expect(wrapper.find(".isSelected")).toHaveLength(1);
    });

    it("renders correct link route", () => {
      expect(wrapper.find("Link").prop("route")).toBeUndefined();
    });

    describe("when clicking the listing", () => {
      it("clicks the link", () => {
        wrapper.find("Link").simulate("click");
      });

      it("calls the onClick prop", () => {
        expect(component.props.onClick).toHaveBeenCalledTimes(1);
      });
    });

    it("matches snapshot", () => {
      expect(wrapper.render()).toMatchSnapshot();
    });
  });
});

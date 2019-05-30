import { character, game } from "../../../models/root.models";
import ComponentTester from "../../../utilities/ComponentTester";

import CharacterListing from "./CharacterListing";

const testGame = game({
  slug: "game-title",
  title: "Game title"
});

const testCharacter = character({
  imageUrl: "imageUrl",
  name: "Character Name"
});

const component = new ComponentTester(CharacterListing).withDefaultProps({
  ...testCharacter,
  game: testGame,
  onClick: jest.fn()
});

describe("[presentation] <CharacterListing />", () => {
  const { actual, props } = component.mount();

  it("renders with the correct link href when unselected", () => {
    expect(actual.find("Link").prop("href")).toBe("#character-name");
  });

  describe("when clicking the listing", () => {
    it("clicks the link", () => {
      actual.find("Link").simulate("click");
    });

    it("calls the onClick prop", () => {
      expect(props.onClick).toHaveBeenCalledTimes(1);
    });
  });

  it("matches snapshot", () => {
    expect(actual.render()).toMatchSnapshot();
  });
});

import { character, game } from "../../../models/root.models";
import WrapperWithIntl from "../../../utilities/WrapperWithIntl";
import CharacterListing from "./CharacterListing";

const testGame = game({
  slug: "game-title",
  title: "Game title",
});

const testCharacter = character({
  imageUrl: "imageUrl",
  name: "Character Name",
});

const component = new WrapperWithIntl(CharacterListing).withDefaultProps({
  ...testCharacter,
  game: testGame,
  onClick: jest.fn(),
});

describe("[presentation] <CharacterListing />", () => {
  const wrapper = component.mount();

  it("renders with the correct link href when unselected", () => {
    expect(wrapper.find("Link").prop("href")).toBe("#character-name");
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

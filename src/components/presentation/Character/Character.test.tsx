import { character, move, moveset } from "../../../models/root.models";
import WrapperWithIntl from "../../../utilities/WrapperWithIntl";
import Character from "./Character";

const testCharacter = character({
  imageUrl: "imageUrl",
  movesets: [
    moveset({
      moves: [
        move({
          combo: "D,F,LP",
          conditions: "conditions",
          name: "Move 1",
        }),
      ],
      name: "Moveset with conditions",
    }),
    moveset({
      moves: [
        move({
          combo: "D,F,LP",
          name: "Move 2",
        }),
      ],
      name: "Moveset without conditions",
    }),
  ],
  name: "Character Name",
});

const component = new WrapperWithIntl(Character).withDefaultProps(
  testCharacter
);

describe("[presentation] <Character />", () => {
  const wrapper = component.render();

  it("renders the correct id on the heading", () => {
    expect(wrapper.find("h2").attr("id")).toBe("character-name");
  });

  it("renders all movesets", () => {
    expect(wrapper.find(".Character--moveset")).toHaveLength(
      testCharacter.movesets.length
    );
  });

  it("only renders the conditions for the moves that have them", () => {
    expect(wrapper.find(".Move--conditions")).toHaveLength(1);
  });

  it("matches snapshot", () => {
    expect(wrapper).toMatchSnapshot();
  });
});

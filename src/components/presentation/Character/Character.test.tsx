import { character, move, moveset } from "../../../models/root.models";
import ComponentTester from "../../../utilities/ComponentTester";

import Character from "./Character";

const testCharacter = character({
  imageUrl: "imageUrl",
  movesets: [
    moveset({
      moves: [
        move({
          combo: "D,F,LP",
          conditions: "conditions",
          name: "Move 1"
        })
      ],
      name: "Moveset with conditions"
    }),
    moveset({
      moves: [
        move({
          combo: "D,F,LP",
          name: "Move 2"
        })
      ],
      name: "Moveset without conditions"
    })
  ],
  name: "Character Name"
});

const component = new ComponentTester(Character).withDefaultProps(
  testCharacter
);

describe("[presentation] <Character />", () => {
  const { actual } = component.render();

  it("renders the correct id on the heading", () => {
    expect(actual.find("h2").attr("id")).toBe("character-name");
  });

  it("renders all movesets", () => {
    expect(actual.find(".Character--moveset")).toHaveLength(
      testCharacter.movesets.length
    );
  });

  it("only renders the conditions for the moves that have them", () => {
    expect(actual.find(".Move--conditions")).toHaveLength(1);
  });

  it("matches snapshot", () => {
    expect(actual).toMatchSnapshot();
  });
});

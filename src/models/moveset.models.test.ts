import { move, moveset } from "./root.models";

describe("[models] Moveset", () => {
  it("creates a valid object with defaults", () => {
    expect(moveset()).toEqual({
      moves: [],
      name: ""
    });
  });

  it("creates a valid object when all properties are defined", () => {
    const options = {
      moves: [
        {
          name: "Move name"
        }
      ],
      name: "Moveset name"
    };

    expect(moveset(options)).toEqual({
      moves: [move({ name: options.moves[0].name })],
      name: options.name
    });
  });
});

import { move } from "./root.models";

describe("[models] Move", () => {
  it("creates a valid object with defaults", () => {
    expect(move()).toEqual({
      combo: "",
      name: "",
    });
  });

  it("creates a valid object when all properties are defined", () => {
    const options = {
      combo: "D,F,LP",
      conditions: "Test conditions",
      name: "Move name",
    };

    expect(move(options)).toEqual(options);
  });
});

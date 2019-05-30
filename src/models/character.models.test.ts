import { character, moveset } from "./root.models";

describe("[models] Character", () => {
  it("creates a valid object with defaults", () => {
    expect(character()).toEqual({
      imageUrl: "",
      movesets: [],
      name: "",
      slug: ""
    });
  });

  it("creates a valid object when all properties are defined", () => {
    const options = {
      imageUrl: "imageUrl",
      movesets: [
        {
          name: "Moveset name"
        }
      ],
      name: "Character Name",
      slug: "test-character"
    };

    expect(character(options)).toEqual({
      imageUrl: options.imageUrl,
      movesets: [
        moveset({
          name: options.movesets[0].name
        })
      ],
      name: options.name,
      slug: options.slug
    });
  });

  it("generates a slug from the name when no slug is defined", () => {
    expect(character({ name: "Character Name" })).toMatchObject({
      slug: "character-name"
    });
  });
});

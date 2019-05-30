import { character, game } from "./root.models";

describe("[models] Character", () => {
  it("creates a valid object with defaults", () => {
    expect(game()).toEqual({
      characters: [],
      imageUrl: "",
      slug: "",
      title: ""
    });
  });

  it("creates a valid object when all properties are defined", () => {
    const options = {
      characters: [
        {
          name: "Character Name"
        }
      ],
      imageUrl: "imageUrl",
      slug: "test-game",
      title: "Game Title"
    };

    expect(game(options)).toEqual({
      characters: [
        character({
          name: options.characters[0].name
        })
      ],
      imageUrl: options.imageUrl,
      slug: options.slug,
      title: options.title
    });
  });

  it("generates a slug from the title when no slug is defined", () => {
    expect(game({ title: "Game Title" })).toMatchObject({
      slug: "game-title"
    });
  });
});

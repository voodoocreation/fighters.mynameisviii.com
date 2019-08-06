import { DeepPartial } from "redux";

import { createSlugFromString } from "../helpers/dataTransformers";
import { character, ICharacter } from "./character.models";

export interface IGame {
  imageUrl: string;
  slug: string;
  title: string;
  characters: ICharacter[];
}

export const game = (options: DeepPartial<IGame> = {}): IGame => ({
  characters: options.characters ? options.characters.map(character) : [],
  imageUrl: options.imageUrl || "",
  slug: options.slug || createSlugFromString(options.title || ""),
  title: options.title || ""
});

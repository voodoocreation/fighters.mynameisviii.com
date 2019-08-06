import { DeepPartial } from "redux";

import { createSlugFromString } from "../helpers/dataTransformers";
import { IMoveset, moveset } from "./moveset.models";

export interface ICharacter {
  imageUrl: string;
  movesets: IMoveset[];
  name: string;
  slug: string;
}

export const character = (
  options: DeepPartial<ICharacter> = {}
): ICharacter => ({
  imageUrl: options.imageUrl || "",
  movesets: options.movesets ? options.movesets.map(moveset) : [],
  name: options.name || "",
  slug: options.slug || createSlugFromString(options.name || "")
});

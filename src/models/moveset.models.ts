import { DeepPartial } from "redux";

import { IMove, move } from "./move.models";

export interface IMoveset {
  moves: IMove[];
  name: string;
}

export const moveset = (options: DeepPartial<IMoveset> = {}): IMoveset => ({
  moves: options.moves ? options.moves.map(move) : [],
  name: options.name || "",
});

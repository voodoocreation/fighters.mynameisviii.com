import { DeepPartial } from "redux";

export interface IMove {
  combo: string;
  conditions?: string;
  name: string;
}

export const move = (options: DeepPartial<IMove> = {}): IMove => ({
  combo: options.combo || "",
  conditions: options.conditions || undefined,
  name: options.name || ""
});

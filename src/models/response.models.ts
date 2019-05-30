export interface ISuccess<Data> {
  ok: true;
  data: Data;
}

export const success = <T>(data: T): ISuccess<T> => ({ ok: true, data });

export interface IFailure {
  ok: false;
  message: string;
}

export const failure = (message: string): IFailure => ({ ok: false, message });

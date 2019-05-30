import { failure, success } from "../models/root.models";

export const mockWithData = <T>(data: T) => jest.fn(() => success(data));

export const mockWithError = (message: string) =>
  jest.fn(() => failure(message));

export const mockWithPayload = () =>
  jest.fn(<P>(payload: P) => success(payload));

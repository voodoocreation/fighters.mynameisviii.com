import { failure, success } from "../models/root.models";

export const createMockElement = (
  width = 0,
  height = 0,
  top = 0,
  left = 0
) => ({
  getBoundingClientRect: () => ({
    bottom: top + height,
    left,
    right: left + width,
    top
  })
});

export const findMockCall = (mockFn: any, ...args: any[]) =>
  mockFn.mock.calls.find((call: any) =>
    args.reduce((acc, curr, index) => acc && call[index] === curr, true)
  );

export const mockWithData = <T>(data: T) => jest.fn(() => success(data));

export const mockWithError = (message: string) =>
  jest.fn(() => failure(message));

export const mockWithPayload = () =>
  jest.fn(<P>(payload: P) => success(payload));

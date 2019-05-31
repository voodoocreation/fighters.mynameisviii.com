import { failure, success } from "../models/root.models";
import {
  createMockElement,
  findMockCall,
  mockWithData,
  mockWithError,
  mockWithPayload
} from "./mocks";

describe("[utilities] Mock response", () => {
  it("createMockElement returns a fake object with default dimensions", () => {
    expect(createMockElement().getBoundingClientRect()).toEqual({
      bottom: 0,
      left: 0,
      right: 0,
      top: 0
    });
  });

  it("createMockElement returns a fake object with provided dimensions", () => {
    expect(createMockElement(100, 100, 10, 10).getBoundingClientRect()).toEqual(
      {
        bottom: 110,
        left: 10,
        right: 110,
        top: 10
      }
    );
  });

  it("findMockCall returns the expected mock call", () => {
    const mockFunction = jest.fn((str: string) => str);

    mockFunction("First call");
    mockFunction("Second call");

    expect(findMockCall(mockFunction, "Second call")).toEqual(["Second call"]);
  });

  it("mockWithData creates a mock that returns a success object", () => {
    const data = { test: "Successful" };
    const mockResponse = mockWithData(data);

    expect(mockResponse()).toEqual(success(data));
    expect(mockResponse).toHaveBeenCalledTimes(1);
  });

  it("mockWithError creates a mock that returns a failure object", () => {
    const message = "Server error";
    const mockResponse = mockWithError(message);

    expect(mockResponse()).toEqual(failure(message));
    expect(mockResponse).toHaveBeenCalledTimes(1);
  });

  it("mockWithPayload creates a mock that returns a success object with the payload as the data", () => {
    const payload = { test: "Successful" };
    const mockResponse = mockWithPayload();

    expect(mockResponse(payload)).toEqual(success(payload));
    expect(mockResponse).toHaveBeenCalledTimes(1);
  });
});

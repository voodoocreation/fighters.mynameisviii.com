import { failure, success } from "../models/root.models";
import { mockWithData, mockWithError, mockWithPayload } from "./mockResponse";

describe("[utilities] Mock response", () => {
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

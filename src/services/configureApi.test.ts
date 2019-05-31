import * as apiMethods from "./api/root.api";
import { createApi, createMockApi } from "./configureApi";
import { TRequest } from "./configureHttpClient";

describe("[services] API", () => {
  const httpClient: TRequest = () => new Promise(resolve => resolve());

  describe("when creating the API instance", () => {
    const api = createApi(httpClient);

    it("has all API methods in the resulting object", () => {
      expect(Object.keys(api)).toEqual(Object.keys(apiMethods));
    });

    it("binds the methods correctly", () => {
      for (const method of Object.values(api)) {
        const response = method();

        expect(response).toHaveProperty("data");
        expect(response).toHaveProperty("ok");
      }
    });
  });

  describe("when creating the mock API instance", () => {
    const api = createMockApi();

    it("has all API methods in the resulting object", () => {
      expect(Object.keys(api)).toEqual(Object.keys(apiMethods));
    });

    it("binds the methods as Jest mock functions correctly", () => {
      for (const method of Object.values(api)) {
        const response = method();

        expect(method).toHaveBeenCalledTimes(1);
        expect(response).toHaveProperty("data");
        expect(response).toHaveProperty("ok");
      }
    });
  });
});

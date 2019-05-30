import { mockWithPayload } from "../utilities/mockResponse";
import * as apiMethods from "./api/root.api";

export const createApi = (request: TRequest) => {
  const bindMethods = <M>(methods: M) => {
    const boundMethods: {
      [key in keyof M]: TCurriedReturn<M[key]>
    } = {} as any;

    for (const index of Object.keys(methods) as Array<keyof M>) {
      const method: any = methods[index];
      boundMethods[index] = method(request);
    }

    return boundMethods;
  };

  return bindMethods(apiMethods);
};

export const createMockApi = () => {
  const mockApiMethods = <M>(methods: M) => {
    const mockMethods: { [key in keyof M]: jest.Mock<any> } = {} as any;

    for (const index of Object.keys(methods) as Array<keyof M>) {
      mockMethods[index] = mockWithPayload();
    }

    return mockMethods;
  };

  return mockApiMethods(apiMethods);
};

export type TApi = ReturnType<typeof createApi>;
export type TMockApi = ReturnType<typeof createMockApi>;

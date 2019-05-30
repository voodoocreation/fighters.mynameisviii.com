import {
  getLocalStorage,
  isLocalStorageAvailable,
  removeLocalStorage,
  setLocalStorage
} from "./configureLocalStorage";

import { failure, success } from "../models/root.models";

const ls = window.localStorage;
const store: { [index: string]: string | null } = {};

describe("[services] Local storage", () => {
  const testValue = "__localStorageTest__";

  describe("when feature is available", () => {
    beforeAll(() => {
      Object.defineProperty(global, "localStorage", {
        value: {
          getItem: jest.fn(key => store[key]),
          removeItem: jest.fn(key => {
            store[key] = null;
          }),
          setItem: jest.fn((key, value) => {
            store[key] = value;
          })
        },
        writable: true
      });
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    afterAll(() => {
      Object.defineProperty(global, "localStorage", {
        value: ls,
        writable: true
      });
    });

    it("detects local storage feature correctly when available", () => {
      expect(isLocalStorageAvailable()).toBe(true);
    });

    it("setLocalStorage() stores data correctly", () => {
      const result = setLocalStorage(testValue, testValue);
      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        testValue,
        testValue
      );
      expect(result).toEqual(success(testValue));
    });

    it("getLocalStorage() retrieves data correctly", () => {
      setLocalStorage(testValue, testValue);
      const result = getLocalStorage(testValue);
      expect(window.localStorage.getItem).toHaveBeenCalledWith(testValue);
      expect(result).toEqual(success(testValue));
    });

    it("removeLocalStorage() removes data correctly", () => {
      setLocalStorage(testValue, testValue);
      const result = removeLocalStorage(testValue);
      expect(window.localStorage.removeItem).toHaveBeenCalled();
      expect(result).toEqual(success(testValue));
      expect(getLocalStorage(testValue)).toEqual(success(null));
    });
  });

  describe("when feature is unavailable", () => {
    beforeAll(() => {
      Object.defineProperty(global, "localStorage", {
        value: undefined,
        writable: true
      });
    });

    afterAll(() => {
      Object.defineProperty(global, "localStorage", {
        value: ls,
        writable: true
      });
    });

    it("detects absence of feature correctly", () => {
      expect(isLocalStorageAvailable()).toBe(false);
    });

    it("setLocalStorage() returns error correctly", () => {
      const result = setLocalStorage(testValue, testValue);
      expect(result).toEqual(failure("unavailable"));
    });

    it("getLocalStorage() returns error correctly", () => {
      const result = getLocalStorage(testValue);
      expect(result).toEqual(failure("unavailable"));
    });

    it("removeLocalStorage() returns error correctly", () => {
      const result = removeLocalStorage(testValue);
      expect(result).toEqual(failure("unavailable"));
    });
  });
});

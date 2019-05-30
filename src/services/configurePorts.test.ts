import { failure, success } from "../models/response.models";
import { mockWithError } from "../utilities/mockResponse";
import * as apiMethods from "./api/root.api";
import { createApi } from "./configureApi";
import { configurePorts, configureTestPorts } from "./configurePorts";

describe("[services] Ports", () => {
  describe("when creating the ports object, with all ports defined", () => {
    const mockRequest: TRequest = () => Promise.resolve({});
    const ports = configurePorts({
      api: createApi(mockRequest),
      dataLayer: [],
      features: []
    });

    it("has all ports defined", () => {
      expect(ports).toHaveProperty("api");
      expect(ports).toHaveProperty("dataLayer");
      expect(ports).toHaveProperty("features");
    });

    it("has all API methods defined", () => {
      expect(Object.keys(ports.api)).toEqual(Object.keys(apiMethods));
    });

    it("binds dataLayer.push correctly", () => {
      ports.dataLayer.push({ event: "test.event" });

      expect(ports.dataLayer).toContainEqual({ event: "test.event" });
    });
  });

  describe("when creating the ports object, with no dataLayer or features defined", () => {
    const ports = configurePorts({
      api: createApi(() => Promise.resolve())
    });

    it("has all ports defined", () => {
      expect(ports).toHaveProperty("api");
      expect(ports).toHaveProperty("dataLayer");
      expect(ports).toHaveProperty("features");
    });

    it("has all API methods defined", () => {
      expect(Object.keys(ports.api)).toEqual(Object.keys(apiMethods));
    });

    it("binds dataLayer.push correctly", () => {
      ports.dataLayer.push({ event: "test.event" });

      expect(ports.dataLayer).toContainEqual({ event: "test.event" });
    });
  });

  describe("when creating the mock ports object, with all ports defined", () => {
    const ports = configureTestPorts({
      api: {
        saveSettings: mockWithError("Server error")
      },
      dataLayer: [],
      features: []
    });

    it("has all ports defined", () => {
      expect(ports).toHaveProperty("api");
      expect(ports).toHaveProperty("dataLayer");
      expect(ports).toHaveProperty("features");
    });

    it("has all API methods defined", () => {
      expect(Object.keys(ports.api)).toEqual(Object.keys(apiMethods));
    });

    it("binds dataLayer.push correctly", () => {
      ports.dataLayer.push({ event: "test.event" });

      expect(ports.dataLayer).toContainEqual({ event: "test.event" });
    });

    it("merges API methods correctly", () => {
      expect(ports.api.saveSettings()).toEqual(failure("Server error"));
    });
  });

  describe("when creating the mock ports object, with no ports defined", () => {
    const ports = configureTestPorts({});

    it("has all ports defined", () => {
      expect(ports).toHaveProperty("api");
      expect(ports).toHaveProperty("dataLayer");
      expect(ports).toHaveProperty("features");
    });

    it("has all API methods defined", () => {
      expect(Object.keys(ports.api)).toEqual(Object.keys(apiMethods));
    });

    it("binds dataLayer.push correctly", () => {
      ports.dataLayer.push({ event: "test.event" });

      expect(ports.dataLayer).toContainEqual({ event: "test.event" });
    });

    it("default mocked API methods function correctly", () => {
      const payload = { isSuccessful: true };

      expect(ports.api.saveSettings(payload)).toEqual(success(payload));
    });
  });
});

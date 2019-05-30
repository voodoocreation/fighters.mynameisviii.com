import { mount } from "enzyme";
import merge from "lodash.merge";
import * as React from "react";

import App from "./App";

jest.mock("serviceworker-webpack-plugin/lib/runtime", () => ({
  register: jest.fn(() => new Promise(resolve => resolve()))
}));

jest.mock("../../../../next.routes", () => ({
  Router: {
    route: ""
  }
}));

import routes from "../../../../next.routes";

import * as selectors from "../../../selectors/root.selectors";

const g: any = global;

const setup = async (
  fn: any,
  fromTestProps?: any,
  isServer = false,
  isInInstalledApp = false
) => {
  jest.clearAllMocks();

  g.matchMedia = jest.fn(() => ({ matches: isInInstalledApp }));

  g.isServer = isServer;
  g.__NEXT_DATA__ = {
    props: {
      initialProps: {
        intlProps: {}
      }
    }
  };

  const Component = () => <div className="PageComponent" />;
  const appProps = merge(
    {
      Component,
      asPath: "",
      ctx: {
        isServer: false,
        pathname: "",
        query: {},
        req: {
          intlMessages: {},
          locale: "en-NZ"
        },
        res: {}
      },
      router: {
        pathname: ""
      }
    },
    fromTestProps
  );
  const initialProps = await App.getInitialProps(appProps);
  const props = {
    ...appProps,
    ...initialProps
  };

  return {
    actual: fn(<App {...props} />),
    props
  };
};

describe("[connected] <App />", () => {
  const addEventListener = g.addEventListener;
  const removeEventListener = g.removeEventListener;

  beforeAll(() => {
    g.addEventListener = jest.fn((...args) => addEventListener(...args));
    g.removeEventListener = jest.fn((...args) => removeEventListener(...args));
  });

  it("mounts application correctly on the server", async () => {
    const { actual } = await setup(
      mount,
      {
        ctx: { isServer: g.isServer }
      },
      true
    );

    expect(actual.render()).toMatchSnapshot();
    actual.unmount();
  });

  it("mounts application correctly on the client", async () => {
    const { actual } = await setup(mount);

    expect(actual.render()).toMatchSnapshot();
    actual.unmount();
  });

  it("gets `initialProps` from component correctly", async () => {
    const test = "Test";
    const Component: any = () => <div className="PageComponent" />;

    Component.getInitialProps = async () => ({ test });

    const { actual, props } = await setup(mount, { Component });

    expect(props.initialProps.pageProps).toEqual({ test });

    actual.unmount();
  });

  describe("when checking if the user is in the installed app", () => {
    describe("when the display mode is 'standalone'", () => {
      let result: any;

      it("mounts the component", async () => {
        result = await setup(mount, {}, false, true);
      });

      it("makes a call to window.matchMedia", () => {
        expect(g.matchMedia).toHaveBeenCalledTimes(1);
      });

      it("isInInstalledApp is true in the store", () => {
        expect(
          selectors.isInInstalledApp(result.props.ctx.store.getState())
        ).toBe(true);
      });

      it("unmounts the component", () => {
        result.actual.unmount();
      });
    });

    describe("when the display mode isn't 'standalone'", () => {
      let result: any;

      it("mounts the component", async () => {
        result = await setup(mount, {}, false, false);
      });

      it("makes a call to window.matchMedia", () => {
        expect(g.matchMedia).toHaveBeenCalledTimes(1);
      });

      it("isInInstalledApp is false in the store", () => {
        expect(
          selectors.isInInstalledApp(result.props.ctx.store.getState())
        ).toBe(false);
      });

      it("unmounts the component", () => {
        result.actual.unmount();
      });
    });
  });

  describe("when receiving features from the feature event", () => {
    const feature1 = "feature-1";
    const feature2 = "feature-2";
    let result: any;

    it("mounts the component", async () => {
      result = await setup(mount);
    });

    it("receives a single feature correctly", async () => {
      window.dispatchEvent(new CustomEvent("feature", { detail: feature1 }));

      expect(
        selectors.hasFeature(result.props.ctx.store.getState(), feature1)
      ).toBe(true);
    });

    it("receives multiple features correctly", async () => {
      window.dispatchEvent(
        new CustomEvent("feature", {
          detail: [feature1, feature2]
        })
      );

      expect(
        selectors.hasFeature(result.props.ctx.store.getState(), feature1)
      ).toBe(true);
      expect(
        selectors.hasFeature(result.props.ctx.store.getState(), feature2)
      ).toBe(true);
    });

    it("unmounts the component", () => {
      result.actual.unmount();
    });
  });

  describe("when navigating within the app", () => {
    let result: any;

    it("mounts the component", async () => {
      result = await setup(mount);
    });

    it("handles the onRouteChangeStart event correctly", async () => {
      routes.Router.onRouteChangeStart("/");

      expect(result.props.ctx.store.getState().page.transitioningTo).toBe("/");
    });

    it("handles the onRouteChangeComplete event correctly", async () => {
      routes.Router.onRouteChangeComplete("/");

      expect(
        result.props.ctx.store.getState().page.transitioningTo
      ).toBeUndefined();
      expect(result.props.ctx.store.getState().page.currentRoute).toBe("/");
    });

    it("handles the onRouteChangeError event correctly", async () => {
      routes.Router.onRouteChangeError(new Error("Server error"), "/");

      expect(
        result.props.ctx.store.getState().page.transitioningTo
      ).toBeUndefined();
      expect(result.props.ctx.store.getState().page.error).toEqual({
        message: "Error: Server error",
        status: 500
      });
    });

    it("unmounts the component", () => {
      result.actual.unmount();
    });
  });

  describe("when the browser prompts the user to install the app", () => {
    it("handles dismissed outcome correctly", async () => {
      let isPassing = true;

      try {
        const { actual } = await setup(mount);

        const event: any = new Event("beforeinstallprompt");
        event.userChoice = new Promise(resolve =>
          resolve({ outcome: "dismissed" })
        );
        await window.dispatchEvent(event);

        actual.unmount();
      } catch (error) {
        isPassing = false;
      }

      expect(isPassing).toBe(true);
    });

    it("handles accepted outcome correctly", async () => {
      let isPassing = true;

      try {
        const { actual } = await setup(mount);

        const event: any = new Event("beforeinstallprompt");
        event.userChoice = new Promise(resolve =>
          resolve({ outcome: "accepted" })
        );
        await window.dispatchEvent(event);

        actual.unmount();
      } catch (error) {
        isPassing = false;
      }

      expect(isPassing).toBe(true);
    });
  });

  describe("when registering the service worker", () => {
    let result: any;

    it("mounts the component", async () => {
      result = await setup(mount);
    });

    it("creates an instance of the service worker and registers it", () => {
      const instance = result.actual
        .childAt(0)
        .childAt(0)
        .instance();
      expect(instance.serviceWorkerContainer).toBeDefined();
      expect(instance.serviceWorkerContainer.register).toHaveBeenCalledWith({
        scope: "/"
      });
    });

    it("binds the 'message' event listener to the service worker", () => {
      expect(
        g.findMockCall(navigator.serviceWorker.addEventListener, "message")
      ).toBeDefined();
    });

    it("receives messages from service worker correctly", () => {
      navigator.serviceWorker.dispatchEvent(
        new MessageEvent("message", {
          data: { type: "serviceWorker.activate" }
        })
      );

      expect(result.props.ctx.store.getState().page.hasNewVersion).toBe(true);
    });

    it("unmounts the component", () => {
      result.actual.unmount();
    });

    it("unbinds the 'message' event listener from the service worker", () => {
      expect(
        g.findMockCall(navigator.serviceWorker.removeEventListener, "message")
      ).toBeDefined();
    });

    it("doesn't receive any messages after the component unmounts", () => {
      navigator.serviceWorker.dispatchEvent(
        new MessageEvent("message", {
          data: { type: "serviceWorker.activate" }
        })
      );

      expect(result.props.ctx.store.getState().page.hasNewVersion).toBe(true);
    });
  });
});

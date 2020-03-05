import { mount } from "enzyme";
import { findCall, mockWithResolvedPromise } from "jest-mocks";
import * as React from "react";

import routes from "../../../../next.routes";
import * as actions from "../../../actions/root.actions";
import games from "../../../data/games";
import { error } from "../../../models/root.models";
import MockPageContext from "../../../utilities/MockPageContext";
import { App } from "./App";

jest.mock("serviceworker-webpack-plugin/lib/runtime", () => ({
  register: mockWithResolvedPromise({})
}));
jest.mock("../../../../next.routes", () => ({
  Router: {
    route: ""
  }
}));

class MockPageComponent extends React.Component {
  public static getInitialProps = async () => ({
    mockPageComponentProp: "test"
  });

  public render = () => <div className="MockPageComponent" />;
}

const defineGlobals = (isServer: boolean, locale?: string) => {
  Object.defineProperties(window, {
    __NEXT_DATA__: {
      value: {
        props: {
          initialProps: {
            intlProps: {
              locale
            }
          }
        }
      },
      writable: true
    },
    isServer: {
      value: isServer,
      writable: true
    },
    matchMedia: {
      value: jest.fn(() => ({ matches: true })),
      writable: true
    }
  });
};

const setup = async (context: any, Component: any, locale?: string) => {
  const appContext: any = {
    Component,
    ctx: {
      ...context,
      req: {
        locale
      }
    },
    router: {
      pathname: ""
    },
    store: context.store
  };

  const initialProps = await App.getInitialProps(appContext);
  const props = {
    ...appContext,
    ...initialProps
  };

  return {
    props,
    wrapper: mount(<App {...props} />)
  };
};

describe("[connected] <App />", () => {
  describe("getInitialProps", () => {
    const context = new MockPageContext();

    describe("when on the server", () => {
      let props: any;
      const locale = "en-US";

      const ctx = context
        .withReduxState({
          app: {
            error: error({ message: "Error", status: 404 })
          }
        })
        .toObject(true);

      const appContext: any = {
        Component: MockPageComponent,
        ctx: {
          ...ctx,
          req: {
            locale
          },
          res: {
            statusCode: 200
          }
        },
        router: {
          pathname: ""
        },
        store: ctx.store
      };

      beforeAll(() => {
        context.resetReduxHistory();
        defineGlobals(true, locale);
      });

      it("calls getInitialProps method", async () => {
        props = await App.getInitialProps(appContext);
      });

      it("dispatches actions.initApp.started with expected payload", () => {
        const matchingActions = context.reduxHistory.filter(
          actions.initApp.started.match
        );

        expect(matchingActions).toHaveLength(1);
        expect(matchingActions[0].payload).toEqual({
          games,
          locale
        });
      });

      it("defines pageProps correctly", async () => {
        expect(props.pageProps).toEqual(
          await MockPageComponent.getInitialProps()
        );
      });

      it("defines the response's statusCode correctly", () => {
        ctx.store.dispatch({ type: "ANY" });

        expect(appContext.ctx.res.statusCode).toBe(404);
      });

      it("defines locale correctly", () => {
        expect(props.intlProps.locale).toBe(locale);
      });
    });

    describe("when on the client", () => {
      const locale = "en-US";

      beforeAll(() => {
        context.resetReduxHistory();
        defineGlobals(false, locale);
      });

      let props: any;

      const ctx = context.toObject(false);

      const appContext: any = {
        Component: MockPageComponent,
        ctx: {
          ...ctx,
          req: {
            locale: "en-US"
          }
        },
        router: {
          pathname: ""
        },
        store: ctx.store
      };

      it("calls getInitialProps method", async () => {
        props = await App.getInitialProps(appContext);
      });

      it("dispatches actions.initApp.started with expected payload", () => {
        const matchingActions = context.reduxHistory.filter(
          actions.initApp.started.match
        );

        expect(matchingActions).toHaveLength(1);
        expect(matchingActions[0].payload).toEqual({
          games,
          locale
        });
      });

      it("defines pageProps correctly", async () => {
        expect(props.pageProps).toEqual(
          await MockPageComponent.getInitialProps()
        );
      });

      it("defines locale correctly", () => {
        expect(props.intlProps.locale).toBe(locale);
      });
    });
  });

  describe("when mounting on the server", () => {
    const context = new MockPageContext();

    let result: any;
    const locale = "en-US";

    beforeEach(() => {
      defineGlobals(true, locale);
    });

    it("mounts the component", async () => {
      result = await setup(context.toObject(true), MockPageComponent, locale);
    });

    it("matches snapshot", () => {
      expect(result.wrapper.render()).toMatchSnapshot();
    });

    it("unmounts correctly", () => {
      result.wrapper.unmount();
    });
  });

  describe("when mounting on the client", () => {
    let result: any;
    const context = new MockPageContext();

    const locale = "en-US";

    beforeAll(() => {
      jest.spyOn(window, "removeEventListener");

      defineGlobals(false, locale);
    });

    it("mounts the component", async () => {
      result = await setup(context.toObject(false), MockPageComponent, locale);
    });

    it("dispatch actions.setCurrentRoute", () => {
      expect(
        context.reduxHistory.filter(actions.setCurrentRoute.match)
      ).toHaveLength(1);
    });

    it("dispatches actions.setIsInInstalledApp", () => {
      expect(
        context.reduxHistory.filter(actions.setIsInInstalledApp.match)
      ).toHaveLength(1);
    });

    it("handles feature event correctly", () => {
      const features = ["test"];

      window.dispatchEvent(
        new CustomEvent("feature", {
          detail: features
        })
      );

      const matchingEvents = context.reduxHistory.filter(
        actions.addFeatures.match
      );

      expect(matchingEvents).toHaveLength(1);
      expect(matchingEvents[0].payload).toEqual(features);
    });

    it("handles service worker message events correctly", () => {
      const data = { type: "serviceWorker.activate" };

      navigator.serviceWorker.dispatchEvent(
        new MessageEvent("message", { data })
      );

      const matchingEvents = context.reduxHistory.filter(
        actions.receiveServiceWorkerMessage.match
      );

      expect(matchingEvents).toHaveLength(1);
      expect(matchingEvents[0].payload).toEqual(data);
    });

    it("handles beforeinstallprompt event correctly", async () => {
      const outcome = "dismissed";

      const event: any = new Event("beforeinstallprompt");
      event.userChoice = { outcome };
      await window.dispatchEvent(event);

      const matchingActions = context.reduxHistory.filter(
        actions.trackEvent.match
      );

      expect(matchingActions).toHaveLength(1);
      expect(matchingActions[0].payload).toEqual({
        event: "page.addToHomeScreen.outcome",
        value: outcome
      });
    });

    describe("routing events", () => {
      const route = "/";

      it("triggers onRouteChangeStart", () => {
        routes.Router.onRouteChangeStart(route);
      });

      it("dispatches actions.changeRoute.started with expected payload", () => {
        const matchingActions = context.reduxHistory.filter(
          actions.changeRoute.started.match
        );

        expect(matchingActions).toHaveLength(1);
        expect(matchingActions[0].payload).toBe(route);
      });

      it("triggers onRouteChangeComplete", async () => {
        routes.Router.onRouteChangeComplete(route);
      });

      it("dispatches actions.changeRoute.done with expected payload", async () => {
        const matchingActions = context.reduxHistory.filter(
          actions.changeRoute.done.match
        );

        expect(matchingActions).toHaveLength(1);
        expect(matchingActions[0].payload.params).toBe(route);
      });

      it("triggers onRouteChangeError", async () => {
        routes.Router.onRouteChangeError(new Error("Server error"), route);
      });

      it("dispatches actions.changeRoute.failed with expected error", async () => {
        const matchingActions = context.reduxHistory.filter(
          actions.changeRoute.failed.match
        );

        expect(matchingActions).toHaveLength(1);
        expect(matchingActions[0].payload.error).toBe("Server error");
      });
    });

    it("matches snapshot", () => {
      expect(result.wrapper.render()).toMatchSnapshot();
    });

    it("unmounts correctly", () => {
      result.wrapper.unmount();

      expect(
        findCall(window.removeEventListener as jest.Mock, "feature")
      ).toBeDefined();
      expect(
        findCall(window.removeEventListener as jest.Mock, "beforeinstallprompt")
      ).toBeDefined();
    });
  });

  describe("when mounting when the page has no getInitialProps method", () => {
    let result: any;
    const context = new MockPageContext();

    it("mounts the component", async () => {
      result = await setup(context.toObject(false), () => (
        <div className="MockPageComponent" />
      ));
    });

    it("matches snapshot", () => {
      expect(result.wrapper.render()).toMatchSnapshot();
    });

    it("unmounts correctly", () => {
      result.wrapper.unmount();
    });
  });
});

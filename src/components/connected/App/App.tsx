import { NextContext } from "next";
import withReduxSaga from "next-redux-saga";
import withRedux from "next-redux-wrapper";
import { DefaultQuery } from "next-server/router";
import NextApp, {
  AppProps,
  Container,
  DefaultAppIProps,
  NextAppContext
} from "next/app";
import * as React from "react";
import { addLocaleData } from "react-intl";
import { IntlProvider } from "react-intl-redux";
import { Provider } from "react-redux";

import routes from "../../../../next.routes";
import * as actions from "../../../actions/root.actions";
import { isServer } from "../../../helpers/dom";
import { createStore, TStore } from "../../../store/root.store";
import Page from "../Page/Page";

import en from "react-intl/locale-data/en";

import "../../../scss/index.scss";

addLocaleData([...en]);

export type TContext<Q extends DefaultQuery> = NextContext<Q> & {
  store: TStore;
};

export type TAppContext<Q extends DefaultQuery> = NextAppContext & {
  ctx: TContext<Q>;
  store: TStore;
};

interface IProps extends DefaultAppIProps, AppProps {
  intlProps: {
    locale: string;
    initialNow: Date;
  };
  store: TStore;
}

const getIntlProps = (ctx: NextContext) => {
  const requestProps = isServer()
    ? ctx.req
    : window.__NEXT_DATA__.props.initialProps.intlProps;
  const { locale } = requestProps;

  return {
    initialNow: Date.now(),
    locale: locale || "en-NZ"
  };
};

class App<P extends IProps> extends NextApp<P> {
  public static async getInitialProps({ ctx, Component }: TAppContext<any>) {
    let pageProps = {};

    const unsubscribe = ctx.store.subscribe(() => {
      const state = ctx.store.getState();

      if (state.app.error && ctx.res) {
        ctx.res.statusCode = state.app.error.status;
        unsubscribe();
      }
    });

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    const intlProps = getIntlProps(ctx);

    return { pageProps, intlProps };
  }

  public readonly serviceWorkerContainer: any = undefined;

  constructor(props: P) {
    super(props);

    if (
      !isServer() &&
      "serviceWorker" in navigator &&
      (window.location.protocol === "https:" ||
        window.location.hostname === "localhost")
    ) {
      // tslint:disable-next-line
      this.serviceWorkerContainer = require("serviceworker-webpack-plugin/lib/runtime");
    }

    routes.Router.onRouteChangeStart = this.onRouteChangeStart;
    routes.Router.onRouteChangeComplete = this.onRouteChangeComplete;
    routes.Router.onRouteChangeError = this.onRouteChangeError;
  }

  public componentDidMount() {
    const { store } = this.props;

    store.dispatch(actions.setCurrentRoute(routes.Router.route));

    if (!isServer()) {
      window.addEventListener("feature", this.onReceiveFeature);

      store.dispatch(
        actions.setIsInInstalledApp(
          window.matchMedia("(display-mode: standalone)").matches
        )
      );
    }

    if (this.serviceWorkerContainer) {
      navigator.serviceWorker.addEventListener(
        "message",
        this.onReceiveServiceWorkerPostMessage
      );

      window.addEventListener(
        "beforeinstallprompt",
        this.onBeforeInstallPrompt
      );

      this.serviceWorkerContainer.register({ scope: "/" });
    }
  }

  public componentWillUnmount() {
    window.removeEventListener("feature", this.onReceiveFeature);

    if (this.serviceWorkerContainer) {
      navigator.serviceWorker.removeEventListener(
        "message",
        this.onReceiveServiceWorkerPostMessage
      );

      window.removeEventListener(
        "beforeinstallprompt",
        this.onBeforeInstallPrompt
      );
    }
  }

  public render() {
    const { Component, intlProps, pageProps, store } = this.props;

    return (
      <Container>
        <Provider store={store}>
          <IntlProvider
            defaultLocale="en-NZ"
            initialNow={intlProps.initialNow}
            textComponent={React.Fragment}
          >
            <Page>
              <Component {...pageProps} />
            </Page>
          </IntlProvider>
        </Provider>
      </Container>
    );
  }

  private onReceiveFeature = (event: any) => {
    const { store } = this.props as IProps;

    store.dispatch(actions.addFeatures(event.detail));
  };

  private onReceiveServiceWorkerPostMessage = (event: any) => {
    const { store } = this.props;

    store.dispatch(actions.receiveServiceWorkerMessage(event.data));
  };

  private onBeforeInstallPrompt = async (event: any) => {
    const { store } = this.props;
    const { outcome } = await event.userChoice;

    store.dispatch(
      actions.trackEvent({
        event: "page.addToHomeScreen.outcome",
        value: outcome
      })
    );
  };

  private onRouteChangeStart = (path: string) => {
    const { store } = this.props;

    store.dispatch(actions.changeRoute.started(path));
  };

  private onRouteChangeComplete = (path: string) => {
    const { store } = this.props;

    store.dispatch(actions.changeRoute.done({ params: path, result: {} }));
  };

  private onRouteChangeError = (error: Error, path: string) => {
    const { store } = this.props;

    store.dispatch(
      actions.changeRoute.failed({
        error: {
          message: error.toString(),
          status: 500
        },
        params: path
      })
    );
  };
}

const AppWrapped = withRedux(createStore)(withReduxSaga(App));

export default AppWrapped;

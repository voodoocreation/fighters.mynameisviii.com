import { mount, render, shallow } from "enzyme";
import merge from "lodash.merge";
import * as React from "react";
import { Provider } from "react-redux";
import { DeepPartial, Dispatch, Middleware } from "redux";
import { AnyAction } from "typescript-fsa";

import { IRootReducers } from "../reducers/root.reducers";
import {
  configureTestPorts,
  IPorts,
  ITestPorts,
  ITestPortsParam
} from "../services/configurePorts";
import { configureStore } from "../store/root.store";

export type TRenderMethods = (...args: any[]) => any;

interface IReduxHistory {
  getActions: () => AnyAction[];
  reset: () => void;
}

interface IConnectedReturn<
  M extends TRenderMethods,
  P extends React.ComponentProps<any> = React.ComponentProps<any>
> {
  actual: ReturnType<M>;
  dispatch: Dispatch<AnyAction>;
  ports: ITestPorts;
  props: Required<P>;
  reduxHistory: IReduxHistory;
  store: () => IRootReducers;
}

interface IReturn<
  M extends TRenderMethods,
  P extends React.ComponentProps<any> = React.ComponentProps<any>
> {
  actual: ReturnType<M>;
  props: Required<P>;
}

export default class ComponentTester<
  C extends React.ComponentType<any>,
  IC extends boolean,
  P extends React.ComponentProps<C> = React.ComponentProps<C>
> {
  // Properties that remain throughout instance lifecycle
  protected defaultChildren?: React.ReactNode;
  protected defaultPorts: DeepPartial<ITestPorts> = {};
  protected defaultProps: Partial<P> = {};
  protected defaultReduxState: DeepPartial<IRootReducers> = {};

  // Properties that are cleared whenever shallow/mount/render are called
  protected actionHistory: AnyAction[] = [];
  protected children?: React.ReactNode;
  protected ports: DeepPartial<ITestPorts> = {};
  protected props: Partial<P> = {};
  protected reduxState: DeepPartial<IRootReducers> = {};

  // Redux history
  protected reduxHistory: IReduxHistory = {
    getActions: () => this.actionHistory,
    reset: () => {
      this.actionHistory = [];
    }
  };

  constructor(
    protected readonly Component: C,
    protected readonly isConnected?: IC
  ) {
    this.Component = Component;
    this.isConnected = isConnected;
  }

  public withDefaultChildren(children: React.ReactNode) {
    this.defaultChildren = children;

    return this;
  }

  public withDefaultPorts(ports: ITestPortsParam) {
    this.defaultPorts = ports;

    return this;
  }

  public withDefaultProps(props: Partial<P>) {
    this.defaultProps = props;

    return this;
  }

  public withDefaultReduxState(state: DeepPartial<IRootReducers>) {
    this.defaultReduxState = state;

    return this;
  }

  public withChildren(children: React.ReactNode) {
    this.children = children;

    return this;
  }

  public withPorts(ports: ITestPortsParam) {
    this.ports = ports;

    return this;
  }

  public withProps(props: Partial<P>) {
    this.props = props;

    return this;
  }

  public withReduxState(reduxState: DeepPartial<IRootReducers>) {
    this.reduxState = reduxState;

    return this;
  }

  public shallow = () => this.renderWithMethod(shallow);

  public mount = () => this.renderWithMethod(mount);

  public render = () => this.renderWithMethod(render);

  protected renderWithMethod = <M extends TRenderMethods>(method: M) => {
    const mergedProps: P = merge(
      {
        children: this.children || this.defaultChildren
      },
      this.defaultProps,
      this.props
    );

    let actual: ReturnType<M>;
    let result: IConnectedReturn<M, P> | IReturn<M, P>;

    if (this.isConnected) {
      const { ports, store } = this.configureStore();

      actual = method(
        <Provider store={store}>
          <this.Component {...mergedProps} />
        </Provider>
      );

      result = {
        actual,
        dispatch: store.dispatch,
        ports,
        props: mergedProps,
        reduxHistory: this.reduxHistory,
        store: () => store.getState()
      };
    } else {
      actual = method(<this.Component {...mergedProps} />);

      result = {
        actual,
        props: mergedProps
      };
    }

    this.children = undefined;
    this.ports = {};
    this.props = {};
    this.reduxState = {};

    return result as IC extends true ? IConnectedReturn<M, P> : IReturn<M, P>;
  };

  protected reduxHistoryMiddleware: Middleware = () => next => action => {
    this.actionHistory.push(action);
    return next(action);
  };

  protected configureStore = () => {
    this.reduxHistory.reset();

    const mergedPorts = merge({}, this.defaultPorts, this.ports);
    const mergedReduxState: DeepPartial<IRootReducers> = merge(
      {},
      this.defaultReduxState,
      this.reduxState
    );

    const ports = configureTestPorts(mergedPorts);

    const middlewares = [this.reduxHistoryMiddleware];

    const store = configureStore(
      mergedReduxState,
      ports as IPorts,
      middlewares
    );

    return {
      ports,
      store
    };
  };
}

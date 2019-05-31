declare module "*.json";
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.png";
declare module "*.svg";
declare module "*.yml";
declare module "*.yaml";

declare module "jest-mock-axios";
declare module "lodash.merge";
declare module "react-relative-time";
declare module "serviceworker-webpack-plugin/lib/runtime";
declare module "service-worker-mock";
declare module "service-worker-mock/fetch";

// tslint:disable-next-line
interface Window {
  __NEXT_DATA__: {
    initialProps: any;
    props: any;
    page: string;
  };
  __NEXT_REDUX_STORE__: any;
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: (...args: any[]) => any;
  dataLayer: Array<{}>;
  features: string[];
  google: {
    maps: any;
    [index: string]: any;
  };
  isServer?: boolean;
  Promise: any;
}

type TCurriedReturn<T> = T extends (...args: any[]) => infer R ? R : any;

interface IServiceWorkerMessage {
  type: string;
  payload?: any;
}

interface IAnalyticsEvent {
  event: string;
  params?: {
    [index: string]: string | number;
  };
  value?: string;
}

import actionCreatorFactory from "typescript-fsa";

const createAction = actionCreatorFactory("ANALYTICS");

interface IAnalyticsEvent {
  event: string;
  params?: {
    [index: string]: string | number;
  };
  value?: string;
}

export const trackEvent = createAction<IAnalyticsEvent>("TRACK_EVENT");

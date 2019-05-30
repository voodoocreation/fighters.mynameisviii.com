import actionCreatorFactory from "typescript-fsa";

const actionCreator = actionCreatorFactory("ANALYTICS");

export const trackEvent = actionCreator<IAnalyticsEvent>("TRACK_EVENT");

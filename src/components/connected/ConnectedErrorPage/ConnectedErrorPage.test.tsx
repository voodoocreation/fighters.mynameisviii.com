import ComponentTester from "../../../utilities/ComponentTester";

import ConnectedErrorPage from "./ConnectedErrorPage";

const component = new ComponentTester(
  ConnectedErrorPage,
  true
).withDefaultReduxState({
  page: {
    error: {
      message: "Not found",
      status: 404
    }
  }
});

describe("[connected] <ConnectedErrorPage />", () => {
  it("renders ErrorPage correctly with error from the store", () => {
    const { actual } = component.mount();

    expect(actual.find("ErrorPage").props()).toMatchObject({
      message: "Not found",
      status: 404
    });
  });
});

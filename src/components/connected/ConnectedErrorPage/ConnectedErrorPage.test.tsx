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
  it("renders correctly", () => {
    const { actual } = component.render();

    expect(actual).toMatchSnapshot();
  });
});

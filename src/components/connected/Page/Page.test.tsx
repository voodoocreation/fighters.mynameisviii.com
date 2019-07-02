import ComponentTester from "../../../utilities/ComponentTester";

import Page from "./Page";

const component = new ComponentTester(Page, true)
  .withDefaultProps({
    className: "TestClassName"
  })
  .withDefaultReduxState({
    app: { isLoading: false }
  })
  .withDefaultChildren("Page");

describe("[connected] <Page />", () => {
  describe("when the app isn't loading", () => {
    const { wrapper } = component.render();

    it("doesn't render with isLoading class", () => {
      expect(wrapper.hasClass("isLoading")).toBe(false);
    });

    it("renders children instead of loader", () => {
      expect(wrapper.find(".Page--body").html()).toBe("Page");
    });
  });

  describe("when the app is loading", () => {
    const { wrapper } = component
      .withReduxState({
        app: { isLoading: true }
      })
      .render();

    it("renders with isLoading class", () => {
      expect(wrapper.hasClass("isLoading")).toBe(true);
    });

    it("renders loader instead of children", () => {
      expect(wrapper.find(".Loader")).toHaveLength(1);
    });
  });
});

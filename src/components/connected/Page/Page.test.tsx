import ComponentTester from "../../../utilities/ComponentTester";

import Page from "./Page";

const component = new ComponentTester(Page, true)
  .withDefaultProps({
    className: "TestClassName"
  })
  .withDefaultReduxState({
    page: { isLoading: false }
  })
  .withDefaultChildren("Page");

describe("[connected] <Page />", () => {
  describe("when the app isn't loading", () => {
    const { actual } = component.render();

    it("doesn't render with isLoading class", () => {
      expect(actual.hasClass("isLoading")).toBe(false);
    });

    it("renders children instead of loader", () => {
      expect(actual.find(".Page--body").html()).toBe("Page");
    });
  });

  describe("when the app is loading", () => {
    const { actual } = component
      .withReduxState({
        page: { isLoading: true }
      })
      .render();

    it("renders with isLoading class", () => {
      expect(actual.hasClass("isLoading")).toBe(true);
    });

    it("renders loader instead of children", () => {
      expect(actual.find(".Loader")).toHaveLength(1);
    });
  });
});

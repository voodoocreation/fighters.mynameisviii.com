import ComponentTester from "../../../utilities/ComponentTester";

import NewVersionToast from "./NewVersionToast";

const component = new ComponentTester(NewVersionToast, true);

describe("[connected] <NewVersionToast />", () => {
  describe("when there's no new version available", () => {
    const { actual } = component
      .withReduxState({
        page: {
          hasNewVersion: false
        }
      })
      .render();

    it("doesn't render the toast", () => {
      expect(actual.html()).toBeNull();
    });
  });

  describe("when there's a new version available", () => {
    const { actual } = component
      .withReduxState({
        page: {
          hasNewVersion: true
        }
      })
      .mount();

    it("renders the toast", () => {
      expect(actual.find(".Toast")).toHaveLength(1);
    });

    describe("when clicking the refresh button", () => {
      Object.defineProperty(window.location, "reload", {
        value: jest.fn()
      });

      it("clicks the button", () => {
        actual
          .find("Button.HasNewVersionToast--refreshButton")
          .simulate("click");
      });

      it("triggers a hard refresh", () => {
        expect(window.location.reload).toHaveBeenCalledWith(true);
      });
    });
  });
});

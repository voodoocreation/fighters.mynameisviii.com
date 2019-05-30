import ComponentTester from "../../../utilities/ComponentTester";

import IndexRoute from "./IndexRoute";

const component = new ComponentTester(IndexRoute, true);

describe("[routes] <IndexRoute />", () => {
  describe("when the user is in the installed app", () => {
    const { actual } = component
      .withReduxState({
        page: {
          isInInstalledApp: true
        }
      })
      .render();

    it("doesn't render the install section", () => {
      expect(actual.find(".Home--install")).toHaveLength(0);
    });
  });

  describe("when the user isn't in the installed app", () => {
    const beforeInstallPromptEvent: any = new Event("beforeinstallprompt");
    beforeInstallPromptEvent.prompt = jest.fn();

    const { actual } = component
      .withReduxState({
        page: {
          isInInstalledApp: false
        }
      })
      .mount();

    it("renders the install section", () => {
      expect(actual.find(".Home--install")).toHaveLength(1);
    });

    it("doesn't render the install button yet", () => {
      expect(actual.find(".Home--installButton")).toHaveLength(0);
    });

    it("dispatches beforeinstallprompt event", () => {
      window.dispatchEvent(beforeInstallPromptEvent);
    });

    it("renders the install button", () => {
      expect(actual.update().find("button.Home--installButton")).toHaveLength(
        1
      );
    });

    it("clicks the install button", () => {
      actual
        .update()
        .find("button.Home--installButton")
        .simulate("click");
    });

    it("prompts the user to install the app", () => {
      expect(beforeInstallPromptEvent.prompt).toHaveBeenCalledTimes(1);
    });

    it("unmounts the component", () => {
      actual.unmount();
    });
  });
});

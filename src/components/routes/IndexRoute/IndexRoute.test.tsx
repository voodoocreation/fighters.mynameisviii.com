import WrapperWithRedux from "../../../utilities/WrapperWithRedux";
import IndexRoute from "./IndexRoute";

const component = new WrapperWithRedux(IndexRoute);

describe("[routes] <IndexRoute />", () => {
  describe("when the user is in the installed app", () => {
    const wrapper = component
      .withReduxState({
        app: {
          isInInstalledApp: true
        }
      })
      .mount();

    it("doesn't render the install section", () => {
      expect(wrapper.find(".Home--install")).toHaveLength(0);
    });

    it("unmounts the component", () => {
      wrapper.unmount();
    });
  });

  describe("when the user isn't in the installed app", () => {
    const beforeInstallPromptEvent: any = new Event("beforeinstallprompt");
    beforeInstallPromptEvent.prompt = jest.fn();

    const wrapper = component
      .withReduxState({
        app: {
          isInInstalledApp: false
        }
      })
      .mount();

    it("renders the install section", () => {
      expect(wrapper.find(".Home--install")).toHaveLength(1);
    });

    it("doesn't render the install button yet", () => {
      expect(wrapper.find(".Home--installButton")).toHaveLength(0);
    });

    it("dispatches beforeinstallprompt event", () => {
      window.dispatchEvent(beforeInstallPromptEvent);
    });

    it("renders the install button", () => {
      expect(wrapper.update().find("button.Home--installButton")).toHaveLength(
        1
      );
    });

    it("clicks the install button", () => {
      wrapper
        .update()
        .find("button.Home--installButton")
        .simulate("click");
    });

    it("prompts the user to install the app", () => {
      expect(beforeInstallPromptEvent.prompt).toHaveBeenCalledTimes(1);
    });

    it("unmounts the component", () => {
      wrapper.unmount();
    });
  });
});

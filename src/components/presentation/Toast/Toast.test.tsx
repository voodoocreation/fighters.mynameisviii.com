import ComponentTester from "../../../utilities/ComponentTester";

import Toast from "./Toast";

const component = new ComponentTester(Toast);

describe("[presentation] <Toast />", () => {
  jest.useFakeTimers();

  describe("when hasAutoDismiss prop is true", () => {
    const { actual, props } = component
      .withProps({
        hasAutoDismiss: true,
        onClose: jest.fn()
      })
      .mount();

    it("renders correctly when visible", () => {
      expect(actual.find(".Toast")).toHaveLength(1);
    });

    it("waits for the auto dismiss delay length", () => {
      jest.runTimersToTime(props.autoDismissDelay);
    });

    it("doesn't unrender yet", () => {
      expect(actual.find(".Toast")).toHaveLength(1);
    });

    it("calls the onClose prop", () => {
      expect(props.onClose).toHaveBeenCalledTimes(1);
    });

    it("doesn't render anything after the delay has passed", () => {
      actual.update();
      expect(actual.find(".Toast")).toHaveLength(0);
    });
  });

  describe("when hasAutoDismiss prop is false", () => {
    const { actual, props } = component
      .withProps({
        hasAutoDismiss: false,
        onClose: jest.fn()
      })
      .mount();

    it("renders correctly when visible", () => {
      expect(actual.find(".Toast")).toHaveLength(1);
    });

    it("clicks the close button twice in quick succession", () => {
      actual.find("Button.Toast--closeButton").simulate("click");
      actual.find("Button.Toast--closeButton").simulate("click");
    });

    it("doesn't unrender yet", () => {
      expect(actual.find(".Toast")).toHaveLength(1);
    });

    it("calls the onClose prop", () => {
      expect(props.onClose).toHaveBeenCalledTimes(2);
    });

    it("doesn't render anything after the delay has passed", () => {
      jest.runTimersToTime(200);
      actual.update();
      expect(actual.find(".Toast")).toHaveLength(0);
    });
  });

  describe("when passing isVisible prop", () => {
    const { actual, props } = component
      .withProps({
        hasAutoDismiss: true,
        isVisible: true
      })
      .mount();

    it("renders the toast when visible", () => {
      expect(actual.find(".Toast")).toHaveLength(1);
    });

    it("waits for the auto dismiss delay length", () => {
      jest.runTimersToTime(props.autoDismissDelay);
    });

    it("doesn't unrender yet", () => {
      expect(actual.find(".Toast")).toHaveLength(1);
    });

    it("doesn't render anything after the delay has passed", () => {
      jest.runTimersToTime(200);
      actual.update();
      expect(actual.find(".Toast")).toHaveLength(0);
    });

    it("passes isVisible prop as true again", () => {
      actual.setProps({ isVisible: true });
    });

    it("renders the toast again", () => {
      expect(actual.find(".Toast")).toHaveLength(1);
    });

    it("waits for the auto dismiss delay length again", () => {
      jest.runTimersToTime(props.autoDismissDelay);
    });

    it("doesn't unrender yet", () => {
      expect(actual.find(".Toast")).toHaveLength(1);
    });

    it("doesn't render anything after the delay has passed again", () => {
      jest.runTimersToTime(200);
      actual.update();
      expect(actual.find(".Toast")).toHaveLength(0);
    });

    it("passes isVisible prop as false after it's already hidden", () => {
      actual.setProps({ isVisible: false });
    });

    it("still doesn't render anything", () => {
      expect(actual.find(".Toast")).toHaveLength(0);
    });
  });
});

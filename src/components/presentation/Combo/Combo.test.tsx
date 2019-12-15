import WrapperWithIntl from "../../../utilities/WrapperWithIntl";
import Combo from "./Combo";

const component = new WrapperWithIntl(Combo);

describe("[presentation] <Combo />", () => {
  describe("when rendering a combo with no extra spaces", () => {
    const wrapper = component.withChildren("Hold BL+B,LP,-,HP").render();

    it("renders the correct number of ComboButtons", () => {
      expect(wrapper.find(".ComboButton:not(.isSeparator)")).toHaveLength(4);
    });

    it("renders the correct number of separators", () => {
      expect(wrapper.find(".ComboButton.isSeparator")).toHaveLength(2);
    });

    it("renders the first two buttons as held buttons", () => {
      expect(wrapper.find(".isHeld")).toHaveLength(2);
    });
  });

  describe("when rendering a combo with extra spaces", () => {
    const wrapper = component.withChildren("Hold BL + B, LP, -, HP").render();

    it("renders the correct number of ComboButtons", () => {
      expect(wrapper.find(".ComboButton:not(.isSeparator)")).toHaveLength(4);
    });

    it("renders the correct number of separators", () => {
      expect(wrapper.find(".ComboButton.isSeparator")).toHaveLength(2);
    });

    it("renders the first two buttons as held buttons", () => {
      expect(wrapper.find(".isHeld")).toHaveLength(2);
    });
  });
});

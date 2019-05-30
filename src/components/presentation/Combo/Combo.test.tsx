import ComponentTester from "../../../utilities/ComponentTester";

import Combo from "./Combo";

const component = new ComponentTester(Combo);

describe("[presentation] <Combo />", () => {
  describe("when rendering a combo with no extra spaces", () => {
    const { actual } = component.withChildren("Hold BL+B,LP,-,HP").render();

    it("renders the correct number of ComboButtons", () => {
      expect(actual.find(".ComboButton:not(.isSeparator)")).toHaveLength(4);
    });

    it("renders the correct number of separators", () => {
      expect(actual.find(".ComboButton.isSeparator")).toHaveLength(2);
    });

    it("renders the first two buttons as held buttons", () => {
      expect(actual.find(".isHeld")).toHaveLength(2);
    });
  });

  describe("when rendering a combo with extra spaces", () => {
    const { actual } = component
      .withChildren("Hold BL + B, LP, -, HP")
      .render();

    it("renders the correct number of ComboButtons", () => {
      expect(actual.find(".ComboButton:not(.isSeparator)")).toHaveLength(4);
    });

    it("renders the correct number of separators", () => {
      expect(actual.find(".ComboButton.isSeparator")).toHaveLength(2);
    });

    it("renders the first two buttons as held buttons", () => {
      expect(actual.find(".isHeld")).toHaveLength(2);
    });
  });
});

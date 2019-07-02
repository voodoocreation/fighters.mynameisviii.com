import ComponentTester from "../../../utilities/ComponentTester";

import Button from "./Button";

const component = new ComponentTester(Button).withDefaultChildren(
  "Test button"
);

describe("[presentation] <Button />", () => {
  describe("when isActive prop is false", () => {
    const { wrapper } = component.render();

    it("doesn't render with isActive class", () => {
      expect(wrapper.hasClass("isActive")).toBe(false);
    });
  });

  describe("when isActive prop is true", () => {
    const { wrapper } = component
      .withProps({
        isActive: true
      })
      .render();

    it("renders with isActive class", () => {
      expect(wrapper.hasClass("isActive")).toBe(true);
    });
  });
});

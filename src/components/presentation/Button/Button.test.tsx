import ComponentTester from "../../../utilities/ComponentTester";

import Button from "./Button";

const component = new ComponentTester(Button).withDefaultChildren(
  "Test button"
);

describe("[presentation] <Button />", () => {
  describe("when isActive prop is false", () => {
    const { actual } = component.render();

    it("doesn't render with isActive class", () => {
      expect(actual.hasClass("isActive")).toBe(false);
    });
  });

  describe("when isActive prop is true", () => {
    const { actual } = component
      .withProps({
        isActive: true
      })
      .render();

    it("renders with isActive class", () => {
      expect(actual.hasClass("isActive")).toBe(true);
    });
  });
});

import ComponentTester from "../../../utilities/ComponentTester";

import ComboButton from "./ComboButton";

const component = new ComponentTester(ComboButton);

describe("[presentation] <ComboButton />", () => {
  const rendersIcon = (str: string, icon: string) => {
    const { actual } = component.withChildren(str).mount();

    return (
      actual.find("svg.ComboButton--icon").length === 1 &&
      actual.find(icon).length === 1
    );
  };

  it("renders the correct icon for 'U'", () => {
    expect(rendersIcon("U", "FaArrowUp")).toBe(true);
  });

  it("renders the correct icon for 'F'", () => {
    expect(rendersIcon("F", "FaArrowRight")).toBe(true);
  });

  it("renders the correct icon for 'R'", () => {
    expect(rendersIcon("R", "FaArrowRight")).toBe(true);
  });

  it("renders the correct icon for 'D'", () => {
    expect(rendersIcon("D", "FaArrowDown")).toBe(true);
  });

  it("renders the correct icon for 'B'", () => {
    expect(rendersIcon("B", "FaArrowLeft")).toBe(true);
  });

  it("renders the correct icon for 'L'", () => {
    expect(rendersIcon("L", "FaArrowLeft")).toBe(true);
  });

  it("renders text fallback for unhandled strings", () => {
    const { actual } = component.withChildren("LP").render();
    const text = actual.find(".ComboButton--text");

    expect(text).toHaveLength(1);
    expect(text.html()).toBe("LP");
  });

  it("renders a separator correctly", () => {
    const { actual } = component
      .withChildren("F")
      .withProps({
        isSeparator: true
      })
      .render();

    expect(actual.hasClass("isSeparator")).toBe(true);
  });

  it("renders a held button correctly", () => {
    const { actual } = component
      .withChildren("F")
      .withProps({
        isHeld: true
      })
      .render();

    expect(actual.hasClass("isHeld")).toBe(true);
    expect(actual.find(".ComboButton--hold")).toHaveLength(1);
  });
});

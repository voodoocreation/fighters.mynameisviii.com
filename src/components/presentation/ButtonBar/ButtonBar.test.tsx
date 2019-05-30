import * as React from "react";

import ComponentTester from "../../../utilities/ComponentTester";

import ButtonBar from "./ButtonBar";

const component = new ComponentTester(ButtonBar);

describe("[presentation] <ButtonBar />", () => {
  it("doesn't render anything without any children", () => {
    const { actual } = component.render();

    expect(actual.html()).toBeNull();
  });

  it("renders correctly with children", () => {
    const { actual } = component.withChildren(<div>Button</div>).render();

    expect(actual.hasClass("ButtonBar")).toBe(true);
  });
});

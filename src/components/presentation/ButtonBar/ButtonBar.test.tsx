import * as React from "react";
import { Wrapper } from "react-test-wrapper";

import ButtonBar from "./ButtonBar";

const component = new Wrapper(ButtonBar);

describe("[presentation] <ButtonBar />", () => {
  it("doesn't render anything without any children", () => {
    const wrapper = component.render();

    expect(wrapper.html()).toBeNull();
  });

  it("renders correctly with children", () => {
    const wrapper = component.withChildren(<div>Button</div>).render();

    expect(wrapper.hasClass("ButtonBar")).toBe(true);
  });
});

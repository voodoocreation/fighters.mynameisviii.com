import ComponentTester from "../../../utilities/ComponentTester";

import Loader from "./Loader";

const component = new ComponentTester(Loader).withDefaultProps({
  className: "TestLoader"
});

describe("[presentation] <Loader />", () => {
  it("renders correctly", () => {
    const { actual } = component.render();

    expect(actual).toMatchSnapshot();
  });
});

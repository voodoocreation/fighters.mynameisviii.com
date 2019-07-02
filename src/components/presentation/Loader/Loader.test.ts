import ComponentTester from "../../../utilities/ComponentTester";

import Loader from "./Loader";

const component = new ComponentTester(Loader).withDefaultProps({
  className: "TestLoader"
});

describe("[presentation] <Loader />", () => {
  it("renders correctly", () => {
    const { wrapper } = component.render();

    expect(wrapper).toMatchSnapshot();
  });
});

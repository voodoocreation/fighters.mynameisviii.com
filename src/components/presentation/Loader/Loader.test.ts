import { Wrapper } from "react-test-wrapper";

import Loader from "./Loader";

const component = new Wrapper(Loader).withDefaultProps({
  className: "TestLoader"
});

describe("[presentation] <Loader />", () => {
  it("renders correctly", () => {
    const wrapper = component.render();

    expect(wrapper).toMatchSnapshot();
  });
});

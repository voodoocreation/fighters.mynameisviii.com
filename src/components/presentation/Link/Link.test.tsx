import ComponentTester from "../../../utilities/ComponentTester";

import Link from "./Link";

const component = new ComponentTester(Link);

describe("[presentation] <Link />", () => {
  describe("when router is available and `href` prop is used", () => {
    const { props, wrapper } = component
      .withProps({
        href: "/href",
        router: {
          components: { test: "test" }
        }
      } as any)
      .mount();

    it("renders <Routes.Link />", () => {
      expect(wrapper.find("Link")).toHaveLength(2);
    });

    it("renders <a />", () => {
      expect(wrapper.find("a")).toHaveLength(1);
    });

    it("has expected href attribute", () => {
      expect(wrapper.find("a").prop("href")).toBe(props.href);
    });
  });

  describe("when router is available and `route` prop is used", () => {
    const { props, wrapper } = component
      .withProps({
        route: "/route",
        router: {
          components: { test: "test" }
        }
      } as any)
      .mount();

    it("renders <LinkRoutes />", () => {
      expect(wrapper.find("LinkRoutes")).toHaveLength(1);
    });

    it("renders <NextLink />", () => {
      expect(wrapper.find("Link")).toHaveLength(2);
    });

    it("renders <a />", () => {
      expect(wrapper.find("a")).toHaveLength(1);
    });

    it("has expected href attribute", () => {
      expect(wrapper.find("a").prop("href")).toBe(props.route);
    });
  });

  describe("when router is unavailable and `href` prop is used", () => {
    const { props, wrapper } = component
      .withProps({
        href: "/href",
        router: {
          components: {}
        }
      } as any)
      .mount();

    it("doesn't render <NextLink /> or <Routes.Link />", () => {
      expect(wrapper.find("Link")).toHaveLength(1);
    });

    it("renders <a />", () => {
      expect(wrapper.find("a")).toHaveLength(1);
    });

    it("has expected href attribute", () => {
      expect(wrapper.find("a").prop("href")).toBe(props.href);
    });
  });

  describe("when router is unavailable and `route` prop is used", () => {
    const { props, wrapper } = component
      .withProps({
        route: "/",
        router: {
          components: {}
        }
      } as any)
      .mount();

    it("doesn't render <NextLink /> or <Routes.Link />", () => {
      expect(wrapper.find("Link")).toHaveLength(1);
    });

    it("renders <a />", () => {
      expect(wrapper.find("a")).toHaveLength(1);
    });

    it("has expected href attribute", () => {
      expect(wrapper.find("a").prop("href")).toBe(props.route);
    });
  });

  describe("when isExternal prop is true", () => {
    const { wrapper } = component
      .withProps({
        href: "/",
        isExternal: true
      })
      .render();

    it("renders <a /> with target='_blank' and rel='noopener'", () => {
      expect(wrapper.attr()).toMatchObject({
        rel: "noopener",
        target: "_blank"
      });
    });
  });

  describe("when `href` and `route` props are undefined", () => {
    const { wrapper } = component
      .withProps({
        router: {
          components: { test: "test" }
        }
      } as any)
      .mount();

    it("doesn't render <NextLink /> or <Routes.Link />", () => {
      expect(wrapper.find("Link")).toHaveLength(1);
    });

    it("doesn't render <a />", () => {
      expect(wrapper.find("a")).toHaveLength(0);
    });

    it("renders <span />", () => {
      expect(wrapper.find("span")).toHaveLength(1);
    });
  });
});

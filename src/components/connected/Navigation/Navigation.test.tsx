import * as models from "../../../models/root.models";
import WrapperWithRedux from "../../../utilities/WrapperWithRedux";
import Navigation from "./Navigation";

const game = models.game({
  characters: [
    models.character({
      name: "Test character"
    })
  ],
  slug: "test-game"
});

const component = new WrapperWithRedux(Navigation).withDefaultReduxState({
  games: {
    items: []
  }
});

describe("[connected] <Navigation />", () => {
  describe("when there are no games and no game is selected", () => {
    const wrapper = component.mount();
    const rendered = wrapper.render();

    it("doesn't render the games section", () => {
      expect(rendered.find(".Navigation--games")).toHaveLength(0);
    });

    it("doesn't render the characters section", () => {
      expect(rendered.find(".Navigation--characters")).toHaveLength(0);
    });

    it("disables the characters nav item", () => {
      expect(
        rendered.find(".Navigation--primary--characters").prop("disabled")
      ).toBe(true);
    });
  });

  describe("when a game is selected", () => {
    const wrapper = component
      .withReduxState({
        games: {
          currentSlug: game.slug,
          items: [game]
        }
      })
      .mount();

    it("renders the correct number of games in the menu", () => {
      expect(wrapper.find("GameListing")).toHaveLength(1);
    });

    it("renders the correct number of characters in the menu", () => {
      expect(wrapper.find("CharacterListing")).toHaveLength(
        game.characters.length
      );
    });

    it("enables the characters nav item", () => {
      expect(
        wrapper.find("Button.Navigation--primary--characters").prop("disabled")
      ).toBe(false);
    });

    describe("when clicking the characters button", () => {
      it("clicks the button to open the characters nav section", () => {
        wrapper
          .find("Button.Navigation--primary--characters")
          .simulate("click");
      });

      it("enables the isActive prop on the button", () => {
        expect(
          wrapper
            .find("Button.Navigation--primary--characters")
            .prop("isActive")
        ).toBe(true);
      });

      it("enables the isOpen class on the section", () => {
        expect(wrapper.find(".Navigation--characters").hasClass("isOpen")).toBe(
          true
        );
      });

      it("clicks the button to close the charactes nav section", () => {
        wrapper
          .find("Button.Navigation--primary--characters")
          .simulate("click");
      });

      it("disables the isActive class on the button", () => {
        expect(
          wrapper
            .find("Button.Navigation--primary--characters")
            .prop("isActive")
        ).toBe(false);
      });

      it("disables the isOpen class on the section", () => {
        expect(wrapper.find(".Navigation--characters").hasClass("isOpen")).toBe(
          false
        );
      });
    });

    describe("when clicking the games button", () => {
      it("clicks the button to open the games nav section", () => {
        wrapper.find("Button.Navigation--primary--games").simulate("click");
      });

      it("enables the isActive prop on the button", () => {
        expect(
          wrapper.find("Button.Navigation--primary--games").prop("isActive")
        ).toBe(true);
      });

      it("enables the isOpen class on the section", () => {
        expect(wrapper.find(".Navigation--games").hasClass("isOpen")).toBe(
          true
        );
      });
    });
  });
});

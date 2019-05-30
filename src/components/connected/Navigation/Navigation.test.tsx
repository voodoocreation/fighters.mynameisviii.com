import * as models from "../../../models/root.models";
import ComponentTester from "../../../utilities/ComponentTester";

import Navigation from "./Navigation";

const game = models.game({
  characters: [
    models.character({
      name: "Test character"
    })
  ],
  slug: "test-game"
});

const component = new ComponentTester(Navigation, true).withDefaultReduxState({
  games: {
    items: []
  }
});

describe("[connected] <Navigation />", () => {
  describe("when there are no games and no game is selected", () => {
    const { actual } = component.render();

    it("doesn't render the games section", () => {
      expect(actual.find(".Navigation--games")).toHaveLength(0);
    });

    it("doesn't render the characters section", () => {
      expect(actual.find(".Navigation--characters")).toHaveLength(0);
    });

    it("disables the characters nav item", () => {
      expect(
        actual.find(".Navigation--primary--characters").prop("disabled")
      ).toBe(true);
    });
  });

  describe("when a game is selected", () => {
    const { actual } = component
      .withReduxState({
        games: {
          currentSlug: game.slug,
          items: [game]
        }
      })
      .mount();

    it("renders the correct number of games in the menu", () => {
      expect(actual.find("GameListing")).toHaveLength(1);
    });

    it("renders the correct number of characters in the menu", () => {
      expect(actual.find("CharacterListing")).toHaveLength(
        game.characters.length
      );
    });

    it("enables the characters nav item", () => {
      expect(
        actual.find("Button.Navigation--primary--characters").prop("disabled")
      ).toBe(false);
    });

    describe("when clicking the characters button", () => {
      it("clicks the button to open the characters nav section", () => {
        actual.find("Button.Navigation--primary--characters").simulate("click");
      });

      it("enables the isActive prop on the button", () => {
        expect(
          actual.find("Button.Navigation--primary--characters").prop("isActive")
        ).toBe(true);
      });

      it("enables the isOpen class on the section", () => {
        expect(actual.find(".Navigation--characters").hasClass("isOpen")).toBe(
          true
        );
      });

      it("clicks the button to close the charactes nav section", () => {
        actual.find("Button.Navigation--primary--characters").simulate("click");
      });

      it("disables the isActive class on the button", () => {
        expect(
          actual.find("Button.Navigation--primary--characters").prop("isActive")
        ).toBe(false);
      });

      it("disables the isOpen class on the section", () => {
        expect(actual.find(".Navigation--characters").hasClass("isOpen")).toBe(
          false
        );
      });
    });

    describe("when clicking the games button", () => {
      it("clicks the button to open the games nav section", () => {
        actual.find("Button.Navigation--primary--games").simulate("click");
      });

      it("enables the isActive prop on the button", () => {
        expect(
          actual.find("Button.Navigation--primary--games").prop("isActive")
        ).toBe(true);
      });

      it("enables the isOpen class on the section", () => {
        expect(actual.find(".Navigation--games").hasClass("isOpen")).toBe(true);
      });
    });
  });
});

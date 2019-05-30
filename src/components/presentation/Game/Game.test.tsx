import * as React from "react";

import { character, game } from "../../../models/root.models";
import ComponentTester from "../../../utilities/ComponentTester";

import Game from "./Game";

const testGame = game({
  characters: [
    character({
      name: "Test character 1"
    }),
    character({
      name: "Test character 2"
    })
  ],
  imageUrl: "imageUrl",
  title: "Test Game"
});

const component = new ComponentTester(Game).withDefaultProps(testGame);

describe("[presentation] <Game />", () => {
  const scrollToMock = jest.fn();
  const { actual } = component.mount();

  jest.useFakeTimers();

  beforeAll(() => {
    Object.defineProperties(actual.find(".Game--characters").instance(), {
      clientWidth: {
        value: 200
      },
      querySelector: {
        value: () => <div />
      },
      scrollLeft: {
        value: 200
      },
      scrollTo: {
        value: scrollToMock
      }
    });
  });

  it("renders all characters", () => {
    expect(actual.find("Character")).toHaveLength(testGame.characters.length);
  });

  it("renders the character list with the correct width", () => {
    expect(actual.find(".Game--characters--items").prop("style")).toMatchObject(
      {
        width: `${100 * testGame.characters.length}%`
      }
    );
  });

  describe("when scrolling characters on a desktop", () => {
    afterAll(() => {
      jest.clearAllMocks();
    });

    it("performs two scrolls in quick succession", () => {
      actual.find(".Game--characters").simulate("scroll");
      actual.find(".Game--characters").simulate("scroll");
    });

    it("doesn't update current location hash yet", () => {
      expect(window.location.hash).toBe("");
    });

    it("doesn't scroll to the character heading yet", () => {
      expect(scrollToMock).toHaveBeenCalledTimes(0);
    });

    it("runs for 100ms", () => {
      jest.runTimersToTime(100);
    });

    it("updates the current location hash", () => {
      expect(window.location.hash).toBe("#test-character-2");
    });

    it("scrolls to the character heading once", () => {
      expect(scrollToMock).toHaveBeenCalledTimes(1);
    });
  });

  describe("when scrolling characters on a mobile device", () => {
    afterAll(() => {
      jest.clearAllMocks();
    });

    it("begins touch event", () => {
      actual.find(".Game--characters").simulate("touchstart");
    });

    it("renders with isTouching class", () => {
      expect(actual.find(".Game--characters").hasClass("isTouching")).toBe(
        true
      );
    });

    it("scrolls container", () => {
      actual.find(".Game--characters").simulate("scroll");
      jest.runTimersToTime(100);
    });

    it("finishes touch event", () => {
      actual.find(".Game--characters").simulate("touchend");
    });

    it("renders without isTouching class", () => {
      expect(actual.find(".Game--characters").hasClass("isTouching")).toBe(
        false
      );
    });

    it("updates the current location hash", () => {
      expect(window.location.hash).toBe("#test-character-2");
    });

    it("scrolls to the character heading once", () => {
      expect(scrollToMock).toHaveBeenCalledTimes(1);
    });
  });
});

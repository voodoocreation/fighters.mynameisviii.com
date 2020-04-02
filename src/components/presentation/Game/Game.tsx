import cn from "classnames";
import * as React from "react";

import { IGame } from "../../../models/root.models";
import Character from "../Character/Character";

import "./Game.scss";

type IProps = IGame;

export default class Game extends React.Component<IProps> {
  public readonly state = {
    isTouching: false,
  };

  private scrollTimeout: NodeJS.Timeout | undefined = undefined;
  private readonly charactersRef = React.createRef<HTMLElement>();

  public render() {
    const { characters, title } = this.props;
    const { isTouching } = this.state;

    return (
      <article className="Game">
        <h1>{title}</h1>

        <section
          className={cn("Game--characters", { isTouching })}
          ref={this.charactersRef}
          onScroll={this.onScroll}
          onTouchEnd={this.onTouchEnd}
          onTouchStart={this.onTouchStart}
        >
          <div
            className="Game--characters--items"
            style={{ width: `${100 * characters.length}%` }}
          >
            {characters.map((character) => (
              <Character {...character} key={character.name} />
            ))}
          </div>
        </section>
      </article>
    );
  }

  private scrollToCharacter = () => {
    const container = this.charactersRef.current as HTMLElement;

    const index = Math.round(container.scrollLeft / container.clientWidth);
    const { slug } = this.props.characters[index];

    if (window.location.hash !== `#${slug}`) {
      window.location.hash = `#${slug}`;
    }

    const characterNode = container.querySelector(
      `.Character--${slug}`
    ) as HTMLElement;

    container.scrollTo(characterNode.offsetLeft - container.offsetLeft, 0);
  };

  private onTouchStart = () => {
    this.setState({ isTouching: true });
  };

  private onTouchEnd = () => {
    this.setState({ isTouching: false });
    this.scrollToCharacter();
  };

  private onScroll = () => {
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }

    this.scrollTimeout = setTimeout(this.onScrollEnd, 100);
  };

  private onScrollEnd = () => {
    if (!this.state.isTouching) {
      this.scrollToCharacter();
    }
  };
}

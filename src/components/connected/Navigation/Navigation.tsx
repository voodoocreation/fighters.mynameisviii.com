import cn from "classnames";
import * as React from "react";
import { FaGamepad, FaHome, FaUsers } from "react-icons/fa";
import {
  FormattedMessage,
  injectIntl,
  WrappedComponentProps,
} from "react-intl";
import { connect } from "react-redux";

import * as dom from "../../../helpers/dom";
import { IGame } from "../../../models/game.models";
import { TStoreState } from "../../../reducers/root.reducers";
import * as selectors from "../../../selectors/root.selectors";
import Button from "../../presentation/Button/Button";
import CharacterListing from "../../presentation/CharacterListing/CharacterListing";
import GameListing from "../../presentation/GameListing/GameListing";
import Link from "../../presentation/Link/Link";

import "./Navigation.scss";

type TNavOption = "games" | "characters" | undefined;

interface IProps extends WrappedComponentProps {
  currentGame?: IGame;
  games: IGame[];
}

interface IState {
  activeNav: TNavOption;
}

class Navigation extends React.Component<IProps, IState> {
  public readonly state: IState = {
    activeNav: undefined,
  };

  public render() {
    return (
      <nav className="Navigation" role="navigation">
        {this.renderPrimarySection()}
        {this.renderGamesSection()}
        {this.renderCharactersSection()}
      </nav>
    );
  }

  private renderPrimarySection = () => {
    const { activeNav } = this.state;

    return (
      <section className="Navigation--primary">
        <Button
          className="Navigation--primary--games"
          isActive={activeNav === "games"}
          onClick={this.onClick("games")}
        >
          <FaGamepad />{" "}
          <span>
            <FormattedMessage id="GAMES" />
          </span>
        </Button>

        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <Link
          className="Navigation--primary--home"
          route="/"
          onClick={this.onClick()}
        >
          <FaHome />{" "}
          <span>
            <FormattedMessage id="HOME" />
          </span>
        </Link>

        <Button
          className="Navigation--primary--characters"
          disabled={!this.props.currentGame}
          isActive={activeNav === "characters"}
          onClick={this.onClick("characters")}
        >
          <FaUsers />{" "}
          <span>
            <FormattedMessage id="CHARACTERS" />
          </span>
        </Button>
      </section>
    );
  };

  private renderGamesSection = () =>
    this.props.games.length > 0 ? (
      <section
        className={cn("Navigation--games", {
          isOpen: this.state.activeNav === "games",
        })}
      >
        <h2>
          <FormattedMessage id="GAMES" />
        </h2>

        <div className="Navigation--games--items">
          {this.props.games.map((game) => (
            <GameListing
              {...game}
              isSelected={
                this.props.currentGame &&
                game.slug === this.props.currentGame.slug
              }
              key={game.slug}
              onClick={this.onClick()}
            />
          ))}
        </div>
      </section>
    ) : null;

  private renderCharactersSection = () => {
    const { currentGame } = this.props;

    return currentGame ? (
      <section
        className={cn("Navigation--characters", {
          isOpen: this.state.activeNav === "characters",
        })}
      >
        <h2>
          <FormattedMessage id="CHARACTERS" />
        </h2>

        <div className="Navigation--characters--items">
          {currentGame.characters.map((character) => (
            <CharacterListing
              {...character}
              game={currentGame}
              key={character.name}
              onClick={this.onClick()}
            />
          ))}
        </div>
      </section>
    ) : null;
  };

  private onClick = (nav?: TNavOption) => () => {
    const activeNav = this.state.activeNav !== nav ? nav : undefined;

    dom.unlockScroll();

    this.setState(() => ({
      activeNav,
    }));

    if (activeNav) {
      dom.lockScroll();
    }
  };
}

const mapState = (state: TStoreState) => ({
  currentGame: selectors.getCurrentGame(state),
  games: selectors.getGames(state),
});

export default injectIntl(connect(mapState)(Navigation));

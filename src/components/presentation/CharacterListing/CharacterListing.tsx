import * as React from "react";
import { InjectedIntlProps, injectIntl } from "react-intl";

import { ICharacter, IGame } from "../../../models/root.models";

import Link from "../Link/Link";

import "./CharacterListing.scss";

interface IProps extends ICharacter, InjectedIntlProps {
  game: IGame;
  onClick: () => void;
}

class CharacterListing extends React.Component<IProps> {
  public render() {
    const { imageUrl, game, name, slug } = this.props;
    const { formatMessage } = this.props.intl;

    return (
      <article className="CharacterListing">
        <Link href={`#${slug}`} onClick={this.props.onClick}>
          <img
            src={imageUrl}
            alt={formatMessage(
              { id: "VIEW_MOVES_FOR_CHARACTER_FROM_GAME" },
              { character: name, game: game.title }
            )}
          />
        </Link>
      </article>
    );
  }
}

const CharacterListingWrapped = injectIntl(CharacterListing);

export default CharacterListingWrapped;

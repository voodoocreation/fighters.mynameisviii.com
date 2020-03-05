import * as React from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";

import { ICharacter, IGame } from "../../../models/root.models";
import Link from "../Link/Link";

import "./CharacterListing.scss";

interface IProps extends ICharacter, WrappedComponentProps {
  game: IGame;
  onClick: () => void;
}

const CharacterListing: React.FC<IProps> = ({
  imageUrl,
  game,
  intl,
  name,
  onClick,
  slug
}) => (
  <article className="CharacterListing">
    <Link href={`#${slug}`} onClick={onClick}>
      <img
        alt={intl.formatMessage(
          { id: "VIEW_MOVES_FOR_CHARACTER_FROM_GAME" },
          { character: name, game: game.title }
        )}
        src={imageUrl}
      />
    </Link>
  </article>
);

export default injectIntl(CharacterListing);

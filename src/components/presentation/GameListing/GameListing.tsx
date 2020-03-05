import cn from "classnames";
import * as React from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";

import { IGame } from "../../../models/game.models";
import Link from "../Link/Link";

import "./GameListing.scss";

interface IProps extends IGame, WrappedComponentProps {
  isSelected?: boolean;
  onClick: () => void;
}

const GameListing: React.FC<IProps> = ({
  imageUrl,
  isSelected,
  intl,
  onClick,
  slug,
  title
}) => (
  <article className={cn("GameListing", { isSelected })}>
    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
    <Link route={!isSelected ? `/games/${slug}` : undefined} onClick={onClick}>
      <img
        alt={intl.formatMessage(
          { id: "VIEW_ALL_MOVES_FOR_GAME" },
          { game: title }
        )}
        src={imageUrl}
      />
    </Link>
  </article>
);

GameListing.defaultProps = {
  isSelected: false
};

export default injectIntl(GameListing);

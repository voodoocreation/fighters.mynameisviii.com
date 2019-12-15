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

class GameListing extends React.Component<IProps> {
  public static defaultProps = {
    isSelected: false
  };

  public render() {
    const { imageUrl, isSelected, title } = this.props;
    const { formatMessage } = this.props.intl;

    return (
      <article className={cn("GameListing", { isSelected })}>
        <Link
          route={!isSelected ? `/games/${this.props.slug}` : undefined}
          onClick={this.props.onClick}
        >
          <img
            src={imageUrl}
            alt={formatMessage(
              { id: "VIEW_ALL_MOVES_FOR_GAME" },
              { game: title }
            )}
          />
        </Link>
      </article>
    );
  }
}

export default injectIntl(GameListing);

import Head from "next/head";
import * as React from "react";
import { WrappedComponentProps } from "react-intl";
import { connect } from "react-redux";
import { isServer } from "../../../helpers/dom";

import { absoluteUrl } from "../../../helpers/dataTransformers";
import injectIntlIntoPage from "../../../helpers/injectIntlIntoPage";
import { IGame } from "../../../models/game.models";
import { TStoreState } from "../../../reducers/root.reducers";
import { IPageContext } from "../../connected/App/App";

import ErrorPage from "../../presentation/ErrorPage/ErrorPage";
import Game from "../../presentation/Game/Game";

import * as actions from "../../../actions/root.actions";
import * as selectors from "../../../selectors/root.selectors";

interface IProps extends WrappedComponentProps {
  game?: IGame;
  setCurrentGameSlug: typeof actions.setCurrentGameSlug;
}

class GameRoute extends React.Component<IProps> {
  public static async getInitialProps(context: IPageContext) {
    const { query, store } = context;
    const slug = query.slug as string;

    store.dispatch(actions.setCurrentGameSlug(slug));
  }

  public componentDidMount() {
    this.toggleBodyClass(true);
  }

  public componentWillUnmount() {
    this.toggleBodyClass(false);
  }

  public render() {
    const { game } = this.props;
    const { formatMessage } = this.props.intl;

    if (!game) {
      return <ErrorPage status={404} />;
    }

    const pageTitle = formatMessage({ id: "GAME_TITLE" }, { game: game.title });
    const pageDescription = formatMessage(
      { id: "GAME_DESCRIPTION" },
      { game: game.title }
    );

    return (
      <>
        <Head>
          <title>{pageTitle}</title>
          <meta content={pageDescription} name="description" />
          <meta property="og:title" content={pageTitle} />
          <meta property="og:description" content={pageDescription} />
          <meta
            property="og:url"
            content={absoluteUrl(`/games/${game.slug}/`)}
          />
          <meta property="og:image" content={absoluteUrl(game.imageUrl)} />
        </Head>

        <Game {...game} />
      </>
    );
  }

  private toggleBodyClass = (isEnabled: boolean) => {
    const { game } = this.props;
    const className = game ? `Game--${game.slug}` : "";

    if (!isServer() && className) {
      document.body.classList.toggle(className, isEnabled);
    }
  };
}

const mapState = (state: TStoreState) => ({
  game: selectors.getCurrentGame(state)
});

const GameRouteWrapped = injectIntlIntoPage(
  connect(mapState, actions)(GameRoute)
);

export default GameRouteWrapped;

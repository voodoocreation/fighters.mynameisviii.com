import Head from "next/head";
import * as React from "react";
import { FaBoxOpen, FaGithub } from "react-icons/fa";
import { FormattedMessage, WrappedComponentProps } from "react-intl";
import { connect } from "react-redux";

import { absoluteUrl } from "../../../helpers/dataTransformers";
import injectIntlIntoPage from "../../../helpers/injectIntlIntoPage";
import { TStoreState } from "../../../reducers/root.reducers";
import * as selectors from "../../../selectors/root.selectors";
import Button from "../../presentation/Button/Button";
import ButtonBar from "../../presentation/ButtonBar/ButtonBar";
import Link from "../../presentation/Link/Link";
import Logo from "../../presentation/Logo/Logo";

import "./IndexRoute.scss";

interface IProps extends WrappedComponentProps {
  isInInstalledApp: boolean;
}

interface IState {
  isInstallAvailable: boolean;
}

class IndexRoute extends React.Component<IProps, IState> {
  public readonly state = {
    isInstallAvailable: false,
  };

  private deferredInstallPromptEvent: any = undefined;

  public componentDidMount() {
    window.addEventListener("beforeinstallprompt", this.onBeforeInstallPrompt);
  }

  public componentWillUnmount() {
    window.removeEventListener(
      "beforeinstallprompt",
      this.onBeforeInstallPrompt
    );
  }

  public render() {
    const { formatMessage } = this.props.intl;

    const pageTitle = formatMessage({ id: "INDEX_TITLE" });
    const pageDescription = formatMessage({ id: "INDEX_DESCRIPTION" });

    return (
      <article className="Home">
        <Head>
          <title>{pageTitle}</title>
          <meta content={pageDescription} name="description" />
          <meta content={pageTitle} property="og:title" />
          <meta content={pageDescription} property="og:description" />
          <meta content={absoluteUrl("/")} property="og:url" />
          <meta
            content={absoluteUrl("/static/index-og.jpg")}
            property="og:image"
          />
        </Head>

        <div className="container">
          <Logo />

          <section className="Home--intro">
            <p>
              <FormattedMessage id="INDEX_INTRO_1" />
            </p>
            <p>
              <FormattedMessage id="INDEX_INTRO_2" />
            </p>

            <ButtonBar>
              <Link
                className="Button isStyled"
                href="https://github.com/voodoocreation/fighters.mynameisviii.com"
                isExternal
              >
                <FaGithub /> <FormattedMessage id="VIEW_ON_GITHUB" />
              </Link>
            </ButtonBar>
          </section>

          {!this.props.isInInstalledApp ? (
            <section className="Home--install">
              <h2>
                <FormattedMessage id="INSTALL_THE_APP" />
              </h2>

              <p>
                <FormattedMessage id="INDEX_INSTALL_1" />
              </p>

              {this.state.isInstallAvailable ? (
                <ButtonBar>
                  <Button
                    className="Home--installButton"
                    isStyled
                    onClick={this.onInstallClick}
                  >
                    <FaBoxOpen /> <FormattedMessage id="INSTALL_THE_APP" />
                  </Button>
                </ButtonBar>
              ) : (
                <p>
                  <FormattedMessage id="INDEX_INSTALL_2" />
                </p>
              )}
            </section>
          ) : null}

          <section className="Home--author">
            <h2>
              <FormattedMessage id="ABOUT_THE_AUTHOR" />
            </h2>

            <p>
              <FormattedMessage
                id="INDEX_AUTHOR_1"
                values={{
                  xero: (
                    <Link href="https://www.xero.com" isExternal>
                      <FormattedMessage id="XERO" />
                    </Link>
                  ),
                }}
              />
            </p>
            <p>
              <FormattedMessage id="INDEX_AUTHOR_2" />
            </p>
          </section>
        </div>
      </article>
    );
  }

  private onBeforeInstallPrompt = (event: Event) => {
    this.deferredInstallPromptEvent = event;

    this.setState({
      isInstallAvailable: true,
    });
  };

  private onInstallClick = () => {
    this.deferredInstallPromptEvent.prompt();
  };
}

const mapState = (state: TStoreState) => ({
  isInInstalledApp: selectors.isInInstalledApp(state),
});

export default injectIntlIntoPage(connect(mapState)(IndexRoute));

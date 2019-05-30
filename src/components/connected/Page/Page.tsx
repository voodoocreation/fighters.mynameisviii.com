import cn from "classnames";
import Head from "next/head";
import * as React from "react";
import { InjectedIntlProps, injectIntl } from "react-intl";
import { connect } from "react-redux";

import { IRootReducers } from "../../../reducers/root.reducers";
import * as selectors from "../../../selectors/root.selectors";

import Loader from "../../presentation/Loader/Loader";
import ToastContainer from "../../presentation/ToastContainer/ToastContainer";
import Navigation from "../Navigation/Navigation";

import "./Page.scss";

interface IProps extends InjectedIntlProps {
  className?: string;
  isLoading: boolean;
}

class Page extends React.Component<IProps> {
  public render() {
    const { children, className, isLoading } = this.props;
    const { formatMessage } = this.props.intl;

    return (
      <article className={cn("Page", className, { isLoading })}>
        <Head>
          <meta
            property="og:site_name"
            content={formatMessage({ id: "BRAND_NAME" })}
          />
        </Head>

        <Navigation />

        <main className="Page--body" role="main">
          {isLoading ? <Loader className="PageLoader" /> : children}
        </main>

        <ToastContainer />
      </article>
    );
  }
}

const mapStateToProps = (state: IRootReducers) => ({
  isLoading: selectors.getPageIsLoading(state)
});

const PageWrapped = injectIntl(connect(mapStateToProps)(Page));

export default PageWrapped;

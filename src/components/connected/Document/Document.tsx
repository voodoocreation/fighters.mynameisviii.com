/* eslint-disable react/no-danger */

// istanbul ignore file
import { IncomingMessage } from "http";

import Document, {
  DocumentContext,
  DocumentProps,
  Head,
  Html,
  Main,
  NextScript,
} from "next/document";
import * as React from "react";

const Meta: React.FC = () => (
  <>
    <meta charSet="UTF-8" />
    <meta
      content="width=device-width, initial-scale=1.0, maximum-scale=1.0"
      name="viewport"
    />

    <link href="/static/manifest.json" rel="manifest" />

    <link
      href="/static/favicon/apple-touch-icon.png"
      rel="apple-touch-icon"
      sizes="180x180"
    />
    <link
      href="/static/favicon/favicon-32x32.png"
      rel="icon"
      sizes="32x32"
      type="image/png"
    />
    <link
      href="/static/favicon/favicon-16x16.png"
      rel="icon"
      sizes="16x16"
      type="image/png"
    />
    <link
      color="#000000"
      href="/static/favicon/safari-pinned-tab.svg"
      rel="mask-icon"
    />
    <link href="/static/favicon/favicon.ico" rel="shortcut icon" />
    <meta content="#000000" name="msapplication-TileColor" />
    <meta content="/static/browserconfig.xml" name="msapplication-config" />
    <meta content="#ffffff" name="theme-color" />
  </>
);

const AnalyticsHead: React.FC = () => (
  <script
    dangerouslySetInnerHTML={{
      __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','GTM-P9CMQN4');`,
    }}
  />
);

const AnalyticsBody: React.FC = () => (
  <noscript>
    <iframe
      height="0"
      src="https://www.googletagmanager.com/ns.html?id=GTM-P9CMQN4"
      style={{ display: "none", visibility: "hidden" }}
      title="gtm"
      width="0"
    />
  </noscript>
);

interface IProps extends DocumentProps {
  locale: string;
}

export default class<P extends IProps> extends Document<P> {
  public static getInitialProps = async (context: DocumentContext) => {
    const initialProps = await Document.getInitialProps(context);
    const props = await context.renderPage();
    const req = context.req as IncomingMessage & {
      locale: string;
    };

    return {
      ...initialProps,
      ...props,
      locale: req.locale || "en-NZ",
    };
  };

  public render() {
    const { locale } = this.props as P;

    return (
      <Html lang={locale}>
        <Head>
          <AnalyticsHead />
          <script
            dangerouslySetInnerHTML={{
              __html: `document.documentElement.classList.add("isClientRendered");`,
            }}
          />
          <Meta />
        </Head>
        <body>
          <AnalyticsBody />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

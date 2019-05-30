import * as React from "react";
import { FormattedMessage, InjectedIntlProps, injectIntl } from "react-intl";
import { connect } from "react-redux";

import { IRootReducers } from "../../../reducers/root.reducers";
import * as selectors from "../../../selectors/root.selectors";

import Button from "../../presentation/Button/Button";
import Toast from "../../presentation/Toast/Toast";

interface IProps extends InjectedIntlProps {
  hasNewVersion: boolean;
}

class NewVersionToast extends React.Component<IProps> {
  public render() {
    return (
      <Toast
        className="HasNewVersionToast"
        hasAutoDismiss={false}
        isVisible={this.props.hasNewVersion}
      >
        <p>
          <FormattedMessage id="NEW_VERSION_AVAILABLE" />
        </p>

        <Button
          className="HasNewVersionToast--refreshButton"
          isStyled={true}
          onClick={this.onRefreshClick}
        >
          <FormattedMessage id="LOAD_THE_NEW_VERSION" />
        </Button>
      </Toast>
    );
  }

  private onRefreshClick = () => {
    window.location.reload(true);
  };
}

const mapStateToProps = (state: IRootReducers) => ({
  hasNewVersion: selectors.hasNewVersion(state)
});

const NewVersionToastWrapped = injectIntl(
  connect(mapStateToProps)(NewVersionToast)
);

export default NewVersionToastWrapped;

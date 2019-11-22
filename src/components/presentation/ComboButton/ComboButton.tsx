import cn from "classnames";
import * as React from "react";
import {
  FaArrowDown,
  FaArrowLeft,
  FaArrowRight,
  FaArrowUp
} from "react-icons/fa";
import {
  FormattedMessage,
  injectIntl,
  WrappedComponentProps
} from "react-intl";

import "./ComboButton.scss";

interface IProps extends WrappedComponentProps {
  children: string;
  isHeld?: boolean;
  isSeparator?: boolean;
}

class ComboButton extends React.Component<IProps> {
  public static defaultProps = {
    isHeld: false,
    isSeparator: false
  };

  public render() {
    const { children, isHeld, isSeparator } = this.props;

    return (
      <span
        className={cn(
          "ComboButton",
          { [`ComboButton--${children.toLowerCase()}`]: !isSeparator },
          { isHeld },
          { isSeparator }
        )}
      >
        {isHeld ? (
          <span className="ComboButton--hold isHidden">
            <FormattedMessage id="HOLD" />
          </span>
        ) : null}
        {this.renderIcon()}
      </span>
    );
  }

  private renderIcon = () => {
    const { children } = this.props;

    const iconProps = {
      className: "ComboButton--icon"
    };

    switch (children.toUpperCase()) {
      case "U":
        return <FaArrowUp {...iconProps} />;

      case "F":
      case "R":
        return <FaArrowRight {...iconProps} />;

      case "D":
        return <FaArrowDown {...iconProps} />;

      case "B":
      case "L":
        return <FaArrowLeft {...iconProps} />;

      default:
        return <span className="ComboButton--text">{children}</span>;
    }
  };
}

const ComboButtonWrapped = injectIntl(ComboButton);

export default ComboButtonWrapped;

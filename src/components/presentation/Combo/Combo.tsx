import * as React from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";

import ComboButton from "../ComboButton/ComboButton";

interface IProps extends WrappedComponentProps {
  children: string;
}

class Combo extends React.Component<IProps> {
  public render() {
    return (
      <div className="Combo">
        {this.renderButtons().map((button, index) =>
          React.cloneElement(button, { key: `button-${index}` })
        )}
      </div>
    );
  }

  private renderButtons = () => {
    const { children } = this.props;
    const buttons = [];

    let isHeld = false;

    const combo = children
      .toUpperCase()
      .replace(/\s/gm, "")
      .replace(/HOLD/gm, "HOLD ");

    for (const button of combo.split(/,|\s/g)) {
      if (button === "HOLD") {
        isHeld = true;
        continue;
      }

      if (button === "-") {
        buttons.push(<ComboButton isSeparator={true}>-</ComboButton>);

        isHeld = false;
      } else if (button.includes("+")) {
        for (const multiButton of button.split("+")) {
          buttons.push(
            <ComboButton isHeld={isHeld}>{multiButton}</ComboButton>
          );
          buttons.push(<ComboButton isSeparator={true}>+</ComboButton>);
        }

        delete buttons[buttons.length - 1];

        isHeld = false;
      } else {
        buttons.push(<ComboButton isHeld={isHeld}>{button}</ComboButton>);
        isHeld = false;
      }
    }

    return buttons;
  };
}

const ComboWrapped = injectIntl(Combo);

export default ComboWrapped;

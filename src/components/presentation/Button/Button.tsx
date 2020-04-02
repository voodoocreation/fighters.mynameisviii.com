import cn from "classnames";
import * as React from "react";

import "./Button.scss";

interface IProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean;
  isStyled?: boolean;
}

const Button: React.FC<IProps> = ({
  children,
  className,
  isActive,
  isStyled,
  ...props
}) => (
  // eslint-disable-next-line react/button-has-type
  <button
    className={cn("Button", className, { isActive }, { isStyled })}
    {...props}
  >
    {children}
  </button>
);

Button.defaultProps = {
  isActive: false,
  isStyled: false,
  type: "button",
};

export default Button;

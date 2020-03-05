import cn from "classnames";
import * as React from "react";

import "./ButtonBar.scss";

type IProps = React.HTMLProps<HTMLDivElement>;

const ButtonBar: React.FC<IProps> = ({ children, className, ...props }) =>
  children ? (
    <div {...props} className={cn("ButtonBar", className)}>
      {children}
    </div>
  ) : null;

export default ButtonBar;

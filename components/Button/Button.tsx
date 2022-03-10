import React, { FC } from "react";
import s from "./Button.module.scss";
import cn from "classnames";

interface Props {
  onClick?: () => void;
  type?: "button" | "submit" | "reset" | undefined;
  className?: string;
}

const Button: FC<Props> = ({ children, onClick, type, className }) => {
  return (
    <button className={cn(s.btn, className)} onClick={onClick} type={type}>
      {children}
    </button>
  );
};

export default Button;

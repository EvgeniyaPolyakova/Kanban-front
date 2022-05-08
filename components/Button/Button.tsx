import React from 'react';
import s from './Button.module.scss';
import cn from 'classnames';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const Button = ({ children, className, ...props }: Props) => {
  return (
    <button className={cn(s.btn, className, { [s.disabled]: props.disabled })} {...props}>
      {children}
    </button>
  );
};

export default Button;

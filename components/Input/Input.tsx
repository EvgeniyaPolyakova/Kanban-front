import React from 'react';
import s from './Input.module.scss';
import cn from 'classnames';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  type?: string;
  label?: string;
  name?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errorMessage?: string;
  isInvalid?: boolean;
  className?: string;
}

const Input = ({
  type = 'text',
  label = '',
  name,
  value,
  onChange,
  errorMessage,
  isInvalid,
  className,
  ...props
}: Props) => {
  return (
    <label className={s.label}>
      <span className={s.title}>{label}</span>
      <input
        name={name}
        type={type}
        className={cn(s.input, { [s.invalid]: isInvalid }, className)}
        value={value}
        onChange={onChange}
        {...props}
      />
      {isInvalid && errorMessage && <p className={s.error}>{errorMessage}</p>}
    </label>
  );
};

export default Input;

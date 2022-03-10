import React from "react";
import s from "./Input.module.scss";
import cn from "classnames";

interface Props {
  type: string;
  title: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errorMessage?: string;
  isInvalid?: boolean;
}

const Input: React.FC<Props> = ({
  type,
  title,
  name,
  value,
  onChange,
  errorMessage,
  isInvalid,
}) => {
  return (
    <label className={s.label}>
      <span className={s.title}>{title}</span>
      <input
        name={name}
        type={type}
        className={cn(s.input, { [s.invalid]: isInvalid })}
        value={value}
        onChange={onChange}
      />
      {isInvalid && errorMessage && <p className={s.error}>{errorMessage}</p>}
    </label>
  );
};

export default Input;

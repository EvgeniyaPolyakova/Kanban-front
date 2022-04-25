import React from 'react';
import s from './Card.module.scss';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  onClick: (e: React.MouseEvent<HTMLElement>) => void;
}

const Card = ({ title, onClick, ...props }: Props) => {
  return (
    <button type="button" className={s.card} onClick={onClick} {...props}>
      {title}
    </button>
  );
};

export default Card;

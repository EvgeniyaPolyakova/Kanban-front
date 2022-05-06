import React, { useState } from 'react';
import { CardInterface } from '../../interfaces/card';
import FileIcon from '../../assets/icons/file.svg';
import CheclistIcon from '../../assets/icons/checklist.svg';
import s from './Card.module.scss';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  onClick: (e: React.MouseEvent<HTMLElement>) => void;
  filesAmount: number;
  checklistAmount: number;
}

const Card = ({ title, onClick, filesAmount, checklistAmount, ...props }: Props) => {
  return (
    <button type="button" className={s.card} onClick={onClick} {...props}>
      {title}
      <div className={s.cardAttributes}>
        {filesAmount > 0 && (
          <span className={s.attribute}>
            <FileIcon />
            {filesAmount}
          </span>
        )}
        {checklistAmount > 0 && (
          <span className={s.attribute}>
            <CheclistIcon />
            {checklistAmount}
          </span>
        )}
      </div>
    </button>
  );
};

export default Card;

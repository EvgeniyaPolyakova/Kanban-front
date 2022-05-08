import React, { useMemo, useState } from 'react';
import { CardInterface } from '../../interfaces/card';
import FileIcon from '../../assets/icons/file.svg';
import CheclistIcon from '../../assets/icons/checklist.svg';
import CommentIcon from '../../assets/icons/comment.svg';
import ClockIcon from '../../assets/icons/clock.svg';
import cn from 'classnames';
import s from './Card.module.scss';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  onClick: (e: React.MouseEvent<HTMLElement>) => void;
  filesAmount: number;
  checklistAmount: number;
  commentsAmount: number;
  deadline: string | null | undefined;
  isComplited: boolean;
}

const Card = ({
  title,
  onClick,
  filesAmount,
  checklistAmount,
  commentsAmount,
  deadline,
  isComplited,
  ...props
}: Props) => {
  console.log(deadline);

  const localeDealine = useMemo(() => {
    if (deadline) {
      const dateDeadline = new Date(deadline);
      console.log('dateDeadline', dateDeadline);

      const locDate = dateDeadline.toLocaleString('ru-RU', {
        month: 'numeric',
        day: 'numeric',
      });
      return locDate;
    }
  }, [deadline]);
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
        {commentsAmount > 0 && (
          <span className={s.attribute}>
            <CommentIcon />
            {commentsAmount}
          </span>
        )}

        {deadline && (
          <span className={cn(s.attribute, { [s.complitedDeadline]: isComplited })}>
            <ClockIcon />
            {localeDealine}
          </span>
        )}
      </div>
    </button>
  );
};

export default Card;

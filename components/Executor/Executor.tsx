import Avatar from '../Avatar';
import TrashIcon from '../../assets/icons/trash.svg';
import s from './Executor.module.scss';
import React, { forwardRef, useState } from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

interface Props {
  name: string;
  handleDeleteExecutor: (e: React.MouseEvent<HTMLElement>) => void;
  id: number;
}

const Executor = ({ name, handleDeleteExecutor, id }: Props) => {
  const [isExecutorMenuOpen, setIsExecutorMenuOpen] = useState<boolean>(false);
  const handleClickExecutorAvatar = () => {
    setIsExecutorMenuOpen(prev => !prev);
  };

  return (
    <>
      <Avatar name={name} onClick={handleClickExecutorAvatar} />

      {isExecutorMenuOpen && (
        <div className={s.moreOptionsWrap}>
          <button onClick={handleDeleteExecutor} data-id={id}>
            <TrashIcon />
            удалить
          </button>
        </div>
      )}
    </>
  );
};

export default Executor;

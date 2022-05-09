import s from './DeskItem.module.scss';
import DeskIcon from '../../assets/icons/desk.svg';
import MoreOptionsIcon from '../../assets/icons/three-dots.svg';
import TrashIcon from '../../assets/icons/trash.svg';
import EditIcon from '../../assets/icons/edit-icon.svg';
import Link from 'next/link';
import React, { useState } from 'react';

interface Props {
  name: string;
  id: number;
  handleDeleteDesk: () => void;
}

const DeskItem = ({ name, id, handleDeleteDesk }: Props) => {
  const [isMoreOptionsOpen, setIsMoreOptionOpen] = useState<boolean>(false);

  const handleClickMoreOptions = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMoreOptionOpen(prev => !prev);
  };

  // const handleDeleteDesk = () => {};

  return (
    <div className={s.itemWrap}>
      <Link href={`/desk/${id}`}>
        <a className={s.wrap}>
          <DeskIcon />
          {name}
          <button className={s.moreOptionsBtn} onClick={handleClickMoreOptions}>
            <MoreOptionsIcon />
          </button>
        </a>
      </Link>
      {isMoreOptionsOpen && (
        <div className={s.moreOptionsWrap}>
          <button onClick={handleDeleteDesk}>
            <TrashIcon />
            удалить
          </button>
        </div>
      )}
    </div>
  );
};

export default DeskItem;

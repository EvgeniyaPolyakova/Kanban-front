import React from 'react';
import { NextPage } from 'next';
import { useState } from 'react';
import CreateDesk from '../components/CreateDesk';
import CreateDeskModal from '../components/CreateDeskModal';
import DeskItem from '../components/DeskItem';
import { Layout } from '../components/Layout';
import s from '../styles/desks.module.scss';

const deskArray = ['Доска 1', 'Доска 2'];

const Desks: NextPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [deskName, setDeskName] = useState('');
  const handleClick = () => {
    setIsOpen(true);
  };

  const handleOutsideClick = () => {
    setIsOpen(false);
  };

  const handleCreateDesk = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    deskArray.push(deskName);
    setIsOpen(false);
  };

  return (
    <>
      <Layout>
        <p className={s.title}>Ваши рабочие пространства</p>
        {deskArray.length ? (
          <div className={s.deskListContainer}>
            <div>
              {deskArray.map(desk => (
                <DeskItem key={desk} name={desk} />
              ))}
            </div>
            <CreateDesk onClick={handleClick} />
          </div>
        ) : (
          <>
            <p className={s.message}>У вас пока нет ни одной рабочей доски. Создайте её прямо сейчас!</p>
            <div className={s.btnWrap}>
              <CreateDesk onClick={handleClick} />
            </div>{' '}
          </>
        )}
      </Layout>
      {isOpen && (
        <CreateDeskModal
          value={deskName}
          setValue={setDeskName}
          handleOutsideClick={handleOutsideClick}
          onSubmit={handleCreateDesk}
        />
      )}
    </>
  );
};

export default Desks;

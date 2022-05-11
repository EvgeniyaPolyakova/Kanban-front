import React, { useEffect, useMemo } from 'react';
import { NextPage } from 'next';
import { useState } from 'react';
import CreateDesk from '../components/CreateDesk';
import CreateDeskModal from '../components/CreateDeskModal';
import DeskItem from '../components/DeskItem';
import { Layout } from '../components/Layout';
import s from '../styles/desks.module.scss';
import useLogger from '../hooks/useLogger';
import { createDesk, deleteDesk, getDesksList } from '../api/desks';
import { Desk } from '../interfaces/desk';
import { useUser } from '../hooks/useUser';

const Desks: NextPage = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [deskName, setDeskName] = useState<string>('');
  const logger = useLogger();
  const [deskArray, setDeskArray] = useState<Desk[]>([]);
  const { user } = useUser();

  useEffect(() => {
    if (user)
      (async () => {
        try {
          const { data } = await getDesksList(user?.id);
          setDeskArray(data);
        } catch (err) {
          logger.error(err);
        }
      })();
  }, [user]);

  const handleClick = () => {
    setIsOpen(true);
  };

  const handleOutsideClick = () => {
    setIsOpen(false);
  };

  const handleCreateDesk = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const prevState = deskArray;
    try {
      if (user) {
        const { data } = await createDesk({ userId: user.id, name: deskName });
        setDeskArray(prev => [...prev, data]);
      }
    } catch (err) {
      setDeskArray(prevState);
      logger.error(err);
    }
    setIsOpen(false);
  };

  const handleDeleteDesk = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const prevState = deskArray;

    const { id } = e.currentTarget.dataset;
    if (id) {
      try {
        const newDesksArray = deskArray.filter(desk => desk.id !== +id);
        setDeskArray(newDesksArray);
        await deleteDesk(+id);
      } catch (err) {
        setDeskArray(prevState);
        logger.error(err);
      }
    }
  };

  return (
    <>
      <Layout>
        <p className={s.title}>Ваши рабочие пространства</p>
        {deskArray.length ? (
          <div className={s.deskListContainer}>
            <div>
              {deskArray.map(desk => (
                <DeskItem key={desk.id} name={desk.name} id={desk.id} handleDeleteDesk={handleDeleteDesk} />
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

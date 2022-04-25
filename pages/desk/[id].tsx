import { NextPage } from 'next';
import { Layout } from '../../components/Layout';
import s from '../../styles/desk.module.scss';
import BtnIcon from '../../assets/icons/plus.svg';
import React, { useCallback, useEffect, useState } from 'react';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { DeskColumn } from '../../interfaces/desk';
import OutsideClickHandler from 'react-outside-click-handler';
import CardModal from '../../components/CardModal';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { createColumn, getColumns } from '../../api/columns';
import useLogger from '../../hooks/useLogger';
import { useRouter } from 'next/router';
import { createCard, getCardById, getCards } from '../../api/cards';
import { CardInterface } from '../../interfaces/card';

const Desk: NextPage = () => {
  const [isCreateColumn, setIsCreateColumn] = useState<boolean>(false);
  const [updateColumnId, setUpdateColumnId] = useState<string>('');
  const [columns, setColumns] = useState<DeskColumn[]>([]);
  const [cardName, setCardName] = useState<string>('');
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [columnName, setColumnName] = useState<string>('');
  const [openCardId, setOpenCardId] = useState<number>(-1);
  const [cardData, setCardData] = useState<CardInterface | null>(null);
  const logger = useLogger();
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;
    (async () => {
      try {
        const { data } = await getColumns(+router.query.id!);
        setColumns(data);
      } catch (err) {
        logger.error(err);
      }
    })();
  }, [router.query.id]);

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const { data } = await getCardById(openCardId);
  //       setCardData(data);
  //     } catch (err) {
  //       logger.error(err);
  //     }
  //   })();
  // }, [openCardId]);

  const handleClickCreate = () => {
    setIsCreateColumn(true);
  };

  const handleClickCreateCard = (e: React.MouseEvent<HTMLElement>) => {
    const { id } = e.currentTarget.dataset;

    if (id) setUpdateColumnId(id);
  };

  const handleChangeCardName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardName(e.target.value);
  };

  const handleChangeNewColumnName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColumnName(e.target.value);
  };

  const handleAddNewColumn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const prevState = columns;

    try {
      const { data } = await createColumn({ deskId: +router.query.id!, name: columnName, number: columns.length + 1 });
      setColumns(prev => [...prev, { ...data, cards: [] }]);
      setColumnName('');
    } catch (err) {
      setColumns(prevState);
      logger.error(err);
    }
  };

  const outsideClickCreateCard = () => {
    setUpdateColumnId('-1');
  };

  const outsideClickCreateColumn = () => {
    setIsCreateColumn(false);
  };

  const handleCreateCard = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(columns);
    const currentColumnIdx = columns.findIndex(column => column.id === +updateColumnId);
    const cardsLength = columns[currentColumnIdx].cards.length;

    const prevState = columns;
    try {
      const { data } = await createCard({
        columnId: +updateColumnId,
        userId: 1,
        title: cardName,
        number: cardsLength + 1,
      });
      console.log(data);

      setColumns(prev =>
        prev.map(column =>
          column.id === +updateColumnId
            ? {
                ...column,
                cards: [
                  ...column.cards,
                  data,
                  // {
                  //   id: Date.now(),
                  //   title: cardName,
                  //   columnId: +updateColumnId,
                  //   number: cardsLength + 1,
                  // },
                ],
              }
            : column
        )
      );
      setCardName('');
    } catch (err) {
      logger.error(err);
      setColumns(prevState);
    }
  };

  // console.log(columns);

  const handleCardOpen = (e: React.MouseEvent<HTMLElement>) => {
    const { id } = e.currentTarget.dataset;
    if (id) setOpenCardId(+id);
    setIsCardModalOpen(true);
  };

  const handleCloseCard = useCallback(() => {
    setIsCardModalOpen(false);
  }, []);

  const handleOrderUpdate = (result: DropResult) => {
    if (!result.destination) return;

    const { droppableId: destinationDroppableId, index: destinationIndex } = result.destination;
    const { droppableId: sourceDroppableId, index: sourceIndex } = result.source;

    const destinationColumnIdx = columns.findIndex(column => column.id === +destinationDroppableId);
    const sourceColumnIdx = columns.findIndex(column => column.id === +sourceDroppableId);

    let newColumns = JSON.parse(JSON.stringify(columns));
    const [removedSort] = newColumns[sourceColumnIdx].cards.splice(sourceIndex, 1);
    newColumns[destinationColumnIdx].cards.splice(destinationIndex, 0, removedSort);

    setColumns(newColumns);

    /* ----------------------------------------------------------------------------------- */
    const MIN_RANGE = 0;
    const MAX_RANGE = 1_000_000;

    const isCardFirst = destinationIndex === 0;
    const isCardLast =
      destinationIndex === columns.find(column => column.id === +destinationDroppableId)!.cards.length - 1;

    const nextNumber = isCardLast
      ? MAX_RANGE
      : columns.find(column => column.id === +destinationDroppableId)!.cards[destinationIndex + 1].number;
    const prevNumber = isCardFirst
      ? MIN_RANGE
      : columns.find(column => column.id === +destinationDroppableId)!.cards[destinationIndex].number;

    const newNumber = Math.round(Math.random() * (nextNumber - prevNumber) + prevNumber);
    console.log(newNumber);
  };

  return (
    <>
      <Layout>
        <div className={s.columnsWrapper}>
          <DragDropContext onDragEnd={handleOrderUpdate}>
            {columns.map(column => (
              <div className={s.column} key={column.id}>
                <p className={s.title}>{column.name}</p>
                <div className={s.separator} />

                <Droppable droppableId={`${column.id}`} type="PERSON">
                  {provided => (
                    <div
                      // id="droppable"
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      <div className={s.cardList}>
                        {column.cards.map((card, index) => (
                          <Draggable key={card.id} draggableId={String(card.id)} index={index}>
                            {provided => (
                              <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                <Card data-id={card.id} title={card.title} key={card.id} onClick={handleCardOpen} />
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    </div>
                  )}
                </Droppable>

                {+updateColumnId === column.id ? (
                  <OutsideClickHandler onOutsideClick={outsideClickCreateCard}>
                    <form className={s.createForm} onSubmit={handleCreateCard}>
                      <div className={s.formWrap}>
                        <Input value={cardName} onChange={handleChangeCardName} className={s.inputColumnTitle} />
                        <Button type="submit" disabled={!cardName}>
                          Добавить
                        </Button>
                      </div>
                    </form>
                  </OutsideClickHandler>
                ) : (
                  <button className={s.createCardBtn} type="button" onClick={handleClickCreateCard} data-id={column.id}>
                    <BtnIcon />
                    Добавить карточку
                  </button>
                )}
              </div>
            ))}
          </DragDropContext>

          {isCreateColumn ? (
            <OutsideClickHandler onOutsideClick={outsideClickCreateColumn}>
              <form className={s.createForm} onSubmit={handleAddNewColumn}>
                <div className={s.formWrap}>
                  <Input
                    type="text"
                    name="name"
                    value={columnName}
                    onChange={handleChangeNewColumnName}
                    className={s.inputColumnTitle}
                    // isInvalid={!!formik.errors.name && formik.touched.name}
                    // errorMessage={formik.errors.name}
                  />
                  <Button type="submit">Добавить</Button>
                </div>
              </form>
            </OutsideClickHandler>
          ) : (
            <button className={s.btn} onClick={handleClickCreate}>
              <BtnIcon />
              Добавить колонку
            </button>
          )}
        </div>
      </Layout>
      {isCardModalOpen && <CardModal handleOutsideClick={handleCloseCard} id={openCardId} cardData={cardData} />}
    </>
  );
};

export default Desk;

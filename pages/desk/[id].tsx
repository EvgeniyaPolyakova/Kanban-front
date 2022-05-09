import { NextPage } from 'next';
import { Layout } from '../../components/Layout';
import s from '../../styles/desk.module.scss';
import BtnIcon from '../../assets/icons/plus.svg';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { DeskColumn } from '../../interfaces/desk';
import OutsideClickHandler from 'react-outside-click-handler';
import CardModal from '../../components/CardModal';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { createColumn, getColumns, renameColumn } from '../../api/columns';
import useLogger from '../../hooks/useLogger';
import { useRouter } from 'next/router';
import { createCard, updateCardNumber } from '../../api/cards';
import { CardInterface } from '../../interfaces/card';
import { sortBy } from 'lodash';
import { useUser } from '../../hooks/useUser';

const MIN_RANGE = 0;
const MAX_RANGE = 1_000_000;

const Desk: NextPage = () => {
  const [isCreateColumn, setIsCreateColumn] = useState<boolean>(false);
  const [updateColumnId, setUpdateColumnId] = useState<string>('');
  const [columns, setColumns] = useState<DeskColumn[]>([]);
  const [cardName, setCardName] = useState<string>('');
  const [columnName, setColumnName] = useState<string>('');
  const [newColumnName, setNewColumnName] = useState<string>('');
  const [openCardId, setOpenCardId] = useState<number>(-1);
  const [openCardColumnId, setOpenCardColumnId] = useState<number>(-1);
  const { user } = useUser();
  const logger = useLogger();
  const router = useRouter();

  const activeCard = useMemo(() => {
    const columnIdx = columns.findIndex(column => column.id === openCardColumnId);
    const card = columns[columnIdx]?.cards.find(card => card.id === openCardId);
    return card;
  }, [openCardId, openCardColumnId, columns]);

  useEffect(() => {
    if (!router.isReady) return;
    (async () => {
      try {
        const { data } = await getColumns(+router.query.id!);

        const sortedCards = data.map(column => sortBy(column.cards, ['number']));

        setColumns(
          data.map((data, idx) => {
            return { ...data, cards: sortedCards[idx] };
          })
        );
      } catch (err) {
        logger.error(err);
      }
    })();
  }, [router.query.id]);

  const updateCard = useCallback(
    (columnId: number, cardId: number, field: keyof CardInterface, value: any) => {
      setColumns(prevColumnState =>
        prevColumnState.map(column =>
          column.id !== columnId
            ? column
            : {
                ...column,
                cards: column.cards.map(card => {
                  if (card.id !== cardId) return card;
                  let newValue;
                  const oldValue = card[field];

                  if (Array.isArray(oldValue)) {
                    newValue = [...oldValue, value];
                  } else {
                    newValue = value;
                  }

                  return { ...card, [field]: newValue };
                }),
              }
        )
      );
    },
    [setColumns]
  );

  // const updateComplitedChecklistCard = useCallback(
  //   (columnId: number, cardId: number, field: 'checklists', updateTaskIdx: number) => {
  //     setColumns(prevColumnState =>
  //       prevColumnState.map(column =>
  //         column.id !== columnId
  //           ? column
  //           : {
  //               ...column,
  //               cards: column.cards.map(card => {
  //                card.checklists.map(task => task.id === )

  //               }),
  //             }
  //       )
  //     );
  //   },
  //   [setColumns]
  // );

  const deleteFromCard = useCallback(
    (columnId: number, cardId: number, field: keyof CardInterface, deleteItemId: number) => {
      setColumns(prevColumnState =>
        prevColumnState.map(column =>
          column.id !== columnId
            ? column
            : {
                ...column,
                cards: column.cards.map(card => {
                  if (card.id !== cardId) return card;
                  let newValue;
                  const oldValue = card[field];

                  console.log('deleteItemIdx', deleteItemId);

                  if (Array.isArray(oldValue)) {
                    if (deleteItemId === -1) {
                      newValue = [];
                    } else {
                      newValue = [...oldValue].filter(item => item.id !== deleteItemId);
                    }
                  } else {
                    newValue = oldValue;
                  }

                  return { ...card, [field]: newValue };
                }),
              }
        )
      );
    },
    [setColumns]
  );

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

  const handleChangeNewnewColumnName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewColumnName(e.target.value);
  };

  const handleAddNewColumn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const prevState = columns;

    try {
      const { data } = await createColumn({
        deskId: +router.query.id!,
        name: newColumnName,
        number: columns.length + 1,
      });
      setColumns(prev => [...prev, { ...data, cards: [] }]);
      setNewColumnName('');
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
    let prevNumber = MIN_RANGE;

    const columnIdx = columns.findIndex(column => column.id === +updateColumnId);

    const amount = columns[columnIdx].cards.length;
    if (amount !== 0) {
      prevNumber = columns[columnIdx].cards[amount - 1].number;
    }

    const currentNumber = Math.round(Math.random() * (MAX_RANGE - prevNumber) + prevNumber);

    const prevState = columns;
    try {
      const { data } = await createCard({
        columnId: +updateColumnId,
        userId: user!.id,
        title: cardName,
        number: currentNumber,
      });

      setColumns(prev =>
        prev.map(column =>
          column.id === +updateColumnId
            ? {
                ...column,
                cards: [...column.cards, data],
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

  const handleCardOpen = (e: React.MouseEvent<HTMLElement>) => {
    const { id } = e.currentTarget.dataset;
    const { columnid } = e.currentTarget.dataset;

    if (id) setOpenCardId(+id);
    if (columnid) setOpenCardColumnId(+columnid);
  };

  const handleCloseCard = useCallback(() => {
    setOpenCardColumnId(-1);
    setOpenCardId(-1);
  }, []);

  const handleOrderUpdate = async (result: DropResult) => {
    try {
      if (!result.destination) return;

      let newNumber;
      let isCardFirst;
      let isCardLast;
      let nextNumber;
      let prevNumber;

      const { droppableId: destinationDroppableId, index: destinationIndex } = result.destination;
      const { droppableId: sourceDroppableId, index: sourceIndex } = result.source;

      const destinationColumnIdx = columns.findIndex(column => column.id === +destinationDroppableId);
      const sourceColumnIdx = columns.findIndex(column => column.id === +sourceDroppableId);

      isCardFirst = destinationIndex === 0;

      if (destinationDroppableId === sourceDroppableId) {
        isCardLast =
          destinationIndex === columns.find(column => column.id === +destinationDroppableId)!.cards.length - 1;
        if (destinationIndex > sourceIndex) {
          nextNumber = isCardLast
            ? MAX_RANGE
            : columns.find(column => column.id === +destinationDroppableId)!.cards[destinationIndex + 1].number;
          prevNumber = isCardFirst
            ? MIN_RANGE
            : columns.find(column => column.id === +destinationDroppableId)!.cards[destinationIndex].number;

          newNumber = Math.round(Math.random() * (nextNumber - prevNumber) + prevNumber);
        } else {
          nextNumber = isCardLast
            ? MAX_RANGE
            : columns.find(column => column.id === +destinationDroppableId)!.cards[destinationIndex].number;
          prevNumber = isCardFirst
            ? MIN_RANGE
            : columns.find(column => column.id === +destinationDroppableId)!.cards[destinationIndex - 1].number;

          newNumber = Math.round(Math.random() * (nextNumber - prevNumber) + prevNumber);
        }
      } else {
        if (columns[destinationColumnIdx].cards.length === 0) {
          newNumber = Math.round(Math.random() * (MAX_RANGE - MIN_RANGE) + MIN_RANGE);
        } else {
          isCardLast = destinationIndex === columns.find(column => column.id === +destinationDroppableId)!.cards.length;

          nextNumber = isCardLast
            ? MAX_RANGE
            : columns.find(column => column.id === +destinationDroppableId)!.cards[destinationIndex].number;
          prevNumber = isCardFirst
            ? MIN_RANGE
            : columns.find(column => column.id === +destinationDroppableId)!.cards[destinationIndex - 1].number;

          newNumber = Math.round(Math.random() * (nextNumber - prevNumber) + prevNumber);
        }
      }

      let newColumns: DeskColumn[] = JSON.parse(JSON.stringify(columns));
      const [removedSort] = newColumns[sourceColumnIdx].cards.splice(sourceIndex, 1);
      newColumns[destinationColumnIdx].cards.splice(destinationIndex, 0, { ...removedSort, number: newNumber });

      setColumns(newColumns);
      await updateCardNumber({
        id: newColumns[destinationColumnIdx].cards[destinationIndex].id,
        number: newNumber,
        columnId: destinationColumnIdx + 1,
      });
    } catch (err) {
      logger.error(err);
    }
  };

  const handleChangeColumnName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id } = e.currentTarget.dataset;
    if (id) {
      setColumns(prev => prev.map(column => (column.id === +id ? { ...column, name: e.target.value } : column)));
    }
  };

  const handleFocusColumnName = (e: React.FocusEvent<HTMLInputElement>) => {
    setColumnName(e.target.value);
  };

  const handleBlurColumnName = async (e: React.FocusEvent<HTMLInputElement>) => {
    const { id } = e.currentTarget.dataset;
    if (id) {
      try {
        if (e.target.value !== '') {
          await renameColumn({ id: +id, name: e.target.value });
        } else {
          setColumns(prev => prev.map(column => (column.id === +id ? { ...column, name: columnName } : column)));
          await renameColumn({ id: +id, name: columnName });
        }
      } catch (err) {
        await renameColumn({ id: +id, name: columnName });
        logger.error(err);
      }
    }
  };

  return (
    <>
      <Layout>
        <div className={s.columnsWrapper}>
          <DragDropContext onDragEnd={handleOrderUpdate}>
            {columns.map(column => (
              <div className={s.column} key={column.id}>
                <input
                  value={column.name}
                  onChange={handleChangeColumnName}
                  data-id={column.id}
                  className={s.сolumnName}
                  onFocus={handleFocusColumnName}
                  onBlur={handleBlurColumnName}
                />
                {/* <p className={s.title}>{column.name}</p> */}
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
                                <Card
                                  filesAmount={card.files.length}
                                  checklistAmount={card.checklists.length}
                                  commentsAmount={card.comments.length}
                                  deadline={card.deadline}
                                  isComplited={card.isComplited}
                                  data-id={card.id}
                                  data-columnid={column.id}
                                  title={card.title}
                                  key={card.id}
                                  onClick={handleCardOpen}
                                />
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
                        <Input
                          value={cardName}
                          onChange={handleChangeCardName}
                          className={s.inputColumnTitle}
                          placeholder="Название карточки"
                        />
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
                    value={newColumnName}
                    onChange={handleChangeNewnewColumnName}
                    className={s.inputColumnTitle}
                    placeholder="Название колонки"
                    // isInvalid={!!formik.errors.name && formik.touched.name}
                    // errorMessage={formik.errors.name}
                  />
                  <Button type="submit" disabled={newColumnName === ''}>
                    Добавить
                  </Button>
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
      {activeCard && (
        <CardModal
          handleOutsideClick={handleCloseCard}
          id={openCardId}
          card={activeCard}
          updateCard={updateCard}
          deleteFromCard={deleteFromCard}
        />
      )}
    </>
  );
};

export default Desk;

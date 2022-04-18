import { GetServerSideProps, NextPage } from 'next';
import { Layout } from '../../components/Layout';
import s from '../../styles/desk.module.scss';
import BtnIcon from '../../assets/icons/plus.svg';
import React, { useCallback, useState } from 'react';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { DeskColumn } from '../../interfaces/desk';
import OutsideClickHandler from 'react-outside-click-handler';
import CardModal from '../../components/CardModal';
import { DragDropContext, Droppable, Draggable, resetServerContext, DropResult } from 'react-beautiful-dnd';

const columnsArray: DeskColumn[] = [
  {
    id: 0,
    title: 'Нужно сделать',
    cards: [],
  },
  {
    id: 1,
    title: 'В процессе',
    cards: [],
  },
  {
    id: 2,
    title: 'Готово',
    cards: [],
  },
];

const Desk: NextPage = () => {
  const [createColumn, setCreateColumn] = useState<boolean>(false);
  const [updateColumnId, setUpdateColumnId] = useState<string>('');
  const [columns, setColumns] = useState<DeskColumn[]>(columnsArray);
  const [cardName, setCardName] = useState<string>('');
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [columnName, setColumnName] = useState<string>('');

  const handleClickCreate = () => {
    setCreateColumn(true);
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

  const handleAddNewColumn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setColumns(prev => [...prev, { id: columns.length, title: columnName, cards: [] }]);
    setColumnName('');
  };

  const outsideClickCreateCard = () => {
    setUpdateColumnId('-1');
  };

  const outsideClickCreateColumn = () => {
    setCreateColumn(false);
  };

  const handleCreateCard = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setColumns(prev =>
      prev.map(column =>
        column.id === +updateColumnId
          ? {
              ...column,
              cards: [...column.cards, { id: Date.now(), title: cardName }],
            }
          : column
      )
    );
    setCardName('');
  };

  console.log(columns);

  const handleCardOpen = () => {
    setIsCardModalOpen(true);
  };

  const handleCloseCard = useCallback(() => {
    setIsCardModalOpen(false);
  }, []);


  const handleOrderUpdate = (result: DropResult) => {
    if (!result.destination) return;

    const destinationId = parseInt(result.destination.droppableId);
    const sourceId = parseInt(result.source.droppableId);

    const [removedSort] = columns[sourceId].cards.splice(result.source.index, 1);

    columns[destinationId].cards.splice(result.destination.index, 0, removedSort);
  };

  return (
    <>
      <Layout>
        <div className={s.columnsWrapper}>
          <DragDropContext onDragEnd={handleOrderUpdate}>
            {columns.map(column => (
              <div className={s.column} key={column.id}>
                <p className={s.title}>{column.title}</p>
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
                                <Card title={card.title} key={card.id} onClick={handleCardOpen} />
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

          {createColumn ? (
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
      {isCardModalOpen && <CardModal handleOutsideClick={handleCloseCard} />}
    </>
  );
};

export default Desk;

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  resetServerContext(); // <-- CALL RESET SERVER CONTEXT, SERVER SIDE

  return { props: { data: [] } };
};

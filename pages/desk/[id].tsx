import { NextPage } from "next";
import { Layout } from "../../components/Layout";
import s from "../../styles/desk.module.scss";
import BtnIcon from "../../assets/icons/plus.svg";
import React, { useState } from "react";
import Input from "../../components/Input";
import { useFormik } from "formik";
import * as yup from "yup";
import Button from "../../components/Button";
import Card from "../../components/Card";
import { DeskColumn } from "../../interfaces/desk";
import OutsideClickHandler from "react-outside-click-handler";
import CardModal from "../../components/CardModal";

const validationSchema = yup.object().shape({
  name: yup.string().required("Введите заголовок"),
});

const columnsArray: DeskColumn[] = [
  {
    id: 1,
    title: "Нужно сделать",
    cards: [],
  },
  {
    id: 2,
    title: "В процессе",
    cards: [],
  },
  {
    id: 3,
    title: "Готово",
    cards: [],
  },
];

const Desk: NextPage = () => {
  const [createColumn, setCreateColumn] = useState<boolean>(false);
  const [updateColumnId, setUpdateColumnId] = useState<string>("");
  const [columns, setColumns] = useState<DeskColumn[]>(columnsArray);
  const [cardName, setCardName] = useState<string>("");
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);

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

  const outsideClickCreateCard = () => {
    setUpdateColumnId("0");
  };

  const outsideClickCreateColumn = () => {
    setCreateColumn(false);
  };

  const handleCreateCard = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setColumns((prev) =>
      prev.map((column) =>
        column.id === +updateColumnId
          ? {
              ...column,
              cards: [...column.cards, { id: Date.now(), title: cardName }],
            }
          : column
      )
    );
    setCardName("");
  };

  const handleCardOpen = () => {
    setIsCardModalOpen(true);
  };

  const handleCloseCard = () => {
    setIsCardModalOpen(false);
  };

  const formik = useFormik({
    initialValues: {
      name: "",
    },
    validationSchema,
    onSubmit: (values, formikHelpers) => {
      console.log(values);

      setColumns((prev) => [
        ...prev,
        { id: prev.length + 1, title: values.name, cards: [] },
      ]);
      formikHelpers.resetForm();
    },
  });

  return (
    <>
      <Layout>
        <div className={s.columnsWrapper}>
          {columns.map((column) => (
            <div className={s.column} key={column.id}>
              <p className={s.title}>{column.title}</p>
              <div className={s.separator} />

              <div className={s.cardList}>
                {column.cards.map((card) => (
                  <Card
                    title={card.title}
                    key={card.id}
                    onClick={handleCardOpen}
                  />
                ))}
              </div>
              {+updateColumnId === column.id ? (
                <OutsideClickHandler onOutsideClick={outsideClickCreateCard}>
                  <form className={s.createForm} onSubmit={handleCreateCard}>
                    <div className={s.formWrap}>
                      <Input
                        value={cardName}
                        onChange={handleChangeCardName}
                        className={s.inputColumnTitle}
                      />
                      <Button type="submit" disabled={!cardName}>
                        Добавить
                      </Button>
                    </div>
                  </form>
                </OutsideClickHandler>
              ) : (
                <button
                  className={s.createCardBtn}
                  type="button"
                  onClick={handleClickCreateCard}
                  data-id={column.id}
                >
                  <BtnIcon />
                  Добавить карточку
                </button>
              )}
            </div>
          ))}
          {createColumn ? (
            <OutsideClickHandler onOutsideClick={outsideClickCreateColumn}>
              <form className={s.createForm} onSubmit={formik.handleSubmit}>
                <div className={s.formWrap}>
                  <Input
                    type="text"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    className={s.inputColumnTitle}
                    isInvalid={!!formik.errors.name && formik.touched.name}
                    errorMessage={formik.errors.name}
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

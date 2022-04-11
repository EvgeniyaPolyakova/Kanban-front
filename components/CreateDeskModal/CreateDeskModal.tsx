import { useState } from "react";
import Button from "../Button";
import Input from "../Input";
import s from "./CreateDeskModal.module.scss";
import OutsideClickHandler from "react-outside-click-handler";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as yup from "yup";

interface Props {
  handleOutsideClick: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  setValue: (value: string) => void;
  value: string;
}

const validationSchema = yup.object().shape({
  name: yup.string().required("Введите название"),
});

const CreateDeskModal = ({
  handleOutsideClick,
  onSubmit,
  value,
  setValue,
}: Props) => {
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  // const formik = useFormik({
  //   initialValues: {
  //     name: "",
  //   },
  //   validationSchema,
  //   onSubmit,
  //   // : (values) => {
  //   //   console.log(values);

  //   //   router.push("/desk/1");
  //   // },
  // });

  return (
    <div className={s.modalWrap}>
      <div className={s.modalBackDrop} />
      <div className={s.modalBody}>
        <OutsideClickHandler onOutsideClick={handleOutsideClick}>
          <form className={s.createContainer} onSubmit={onSubmit}>
            <p className={s.title}>Создать доску</p>
            <Input
              name="name"
              type="text"
              title="Название"
              value={value}
              onChange={handleChange}
              // isInvalid={!!formik.errors.name && formik.touched.name}
              // errorMessage={formik.errors.name}
            />
            <Button className={s.btn} type="submit">
              Создать
            </Button>
          </form>
        </OutsideClickHandler>
      </div>
    </div>
  );
};

export default CreateDeskModal;

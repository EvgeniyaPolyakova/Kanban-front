import React, { useState } from "react";
import Input from "../Input";
import Image from "next/image";
import s from "./RegisterForm.module.scss";
import Eye from "../../assets/icons/eye.svg";
import SlachEye from "../../assets/icons/slash-eye.svg";
import EnterIcon from "../../assets/icons/enter.svg";
import Button from "../Button";
import { useFormik } from "formik";
import * as yup from "yup";
import { useUser } from "../../hooks/useUser";
import { useRouter } from "next/router";

const validationSchema = yup.object().shape({
  name: yup.string().required("Введите имя"),
  surname: yup.string().required("Введите фамилию"),
  email: yup
    .string()
    .email("Некорректный email адрес")
    .required("Введите адрес электронной почты"),
  password: yup.string().required("Введите пароль"),
});

const RegisterForm = () => {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const { getToken } = useUser();
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      name: "",
      surname: "",
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: (values) => {
      getToken({ ...values });
      router.push("/desks");
    },
  });

  const handleShowPassword = () => {
    setIsShowPassword((prev) => !prev);
  };

  return (
    <form className={s.form} onSubmit={formik.handleSubmit}>
      <div className={s.formWrap}>
        <div className={s.imageWrap}>
          <Image
            src="/images/enter.webp"
            layout="fill"
            objectFit="cover"
            alt="auth"
            // width={400}
            // height={300}
          />
        </div>
        <div className={s.loginForm}>
          <h3 className={s.mainTitle}>Зарегистрироваться</h3>
          <Input
            name="name"
            title="Имя"
            type="text"
            value={formik.values.name}
            onChange={formik.handleChange}
            isInvalid={!!formik.errors.name && formik.touched.name}
            errorMessage={formik.errors.name}
          />
          <Input
            name="surname"
            title="Фамилия"
            type="text"
            value={formik.values.surname}
            onChange={formik.handleChange}
            isInvalid={!!formik.errors.surname && formik.touched.surname}
            errorMessage={formik.errors.surname}
          />
          <Input
            name="email"
            title="Почта"
            type="text"
            value={formik.values.email}
            onChange={formik.handleChange}
            isInvalid={!!formik.errors.email && formik.touched.email}
            errorMessage={formik.errors.email}
          />
          <div className={s.inputPasswordWrap}>
            <Input
              name="password"
              title="Пароль"
              type={isShowPassword ? "text" : "password"}
              value={formik.values.password}
              onChange={formik.handleChange}
              isInvalid={!!formik.errors.password && formik.touched.password}
              errorMessage={formik.errors.password}
            />
            <button
              type="button"
              className={s.showPasswordBtn}
              onClick={handleShowPassword}
            >
              {isShowPassword ? <SlachEye /> : <Eye />}
            </button>
          </div>
          <Button type="submit" className={s.btn}>
            Зарегистрироваться
          </Button>
        </div>
      </div>
    </form>
  );
};

export default RegisterForm;

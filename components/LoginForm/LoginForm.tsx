import React, { useState } from "react";
import Input from "../Input";
import Image from "next/image";
import s from "./LoginForm.module.scss";
import Eye from "../../assets/icons/eye.svg";
import SlachEye from "../../assets/icons/slash-eye.svg";
import EnterIcon from "../../assets/icons/enter.svg";
import Button from "../Button";
import { useFormik } from "formik";
import * as yup from "yup";

const validationSchema = yup.object().shape({
  login: yup
    .string()
    .email("Некорректный email адрес")
    .required("Введите адрес электронной почты"),
  password: yup.string().required("Введите пароль"),
});

const LoginForm = () => {
  const [isShowPassword, setIsShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      login: "",
      password: "",
    },
    validationSchema,
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
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
          <EnterIcon className={s.enterIcon} />
          <h3 className={s.mainTitle}>Войти</h3>
          <Input
            name="login"
            title="Логин"
            type="text"
            value={formik.values.login}
            onChange={formik.handleChange}
            isInvalid={!!formik.errors.login && formik.touched.login}
            errorMessage={formik.errors.login}
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
            Войти
          </Button>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;

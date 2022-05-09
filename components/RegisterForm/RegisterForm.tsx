import React, { useState } from 'react';
import Input from '../Input';
import Image from 'next/image';
import s from './RegisterForm.module.scss';
import Eye from '../../assets/icons/eye.svg';
import SlashEye from '../../assets/icons/slash-eye.svg';
import Button from '../Button';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useUser } from '../../hooks/useUser';
import { useRouter } from 'next/router';
import useLogger from '../../hooks/useLogger';
import { register } from '../../api/register';

const validationSchema = yup.object().shape({
  name: yup.string().required('Введите имя'),
  surname: yup.string().required('Введите фамилию'),
  email: yup.string().email('Некорректный email адрес').required('Введите адрес электронной почты'),
  password: yup.string().required('Введите пароль'),
});

const RegisterForm = () => {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const { setUser } = useUser();
  const router = useRouter();
  const logger = useLogger();

  const formik = useFormik({
    initialValues: {
      name: '',
      surname: '',
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async values => {
      try {
        const { data } = await register(values);
        setUser(data);
        localStorage.setItem('token', data.token);
        await router.push('/desks');
      } catch (err) {
        logger.error(err);
      }
    },
  });

  const handleShowPassword = () => {
    setIsShowPassword(prev => !prev);
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
            label="Имя"
            type="text"
            isInvalid={!!formik.errors.name && formik.touched.name}
            errorMessage={formik.errors.name}
            {...formik.getFieldProps('name')}
          />
          <Input
            label="Фамилия"
            type="text"
            isInvalid={!!formik.errors.surname && formik.touched.surname}
            errorMessage={formik.errors.surname}
            {...formik.getFieldProps('surname')}
          />
          <Input
            label="Почта"
            isInvalid={!!formik.errors.email && formik.touched.email}
            errorMessage={formik.errors.email}
            {...formik.getFieldProps('email')}
          />
          <div className={s.inputPasswordWrap}>
            <Input
              label="Пароль"
              type={isShowPassword ? 'text' : 'password'}
              isInvalid={!!formik.errors.password && formik.touched.password}
              errorMessage={formik.errors.password}
              {...formik.getFieldProps('password')}
            />
            <button type="button" className={s.showPasswordBtn} onClick={handleShowPassword}>
              {isShowPassword ? <SlashEye /> : <Eye />}
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

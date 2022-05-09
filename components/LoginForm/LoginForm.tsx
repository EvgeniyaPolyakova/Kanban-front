import React, { useState } from 'react';
import Input from '../Input';
import Image from 'next/image';
import s from './LoginForm.module.scss';
import Eye from '../../assets/icons/eye.svg';
import SlashEye from '../../assets/icons/slash-eye.svg';
import EnterIcon from '../../assets/icons/enter.svg';
import Button from '../Button';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useUser } from '../../hooks/useUser';
import { useRouter } from 'next/router';
import useLogger from '../../hooks/useLogger';
import { login } from '../../api/login';

const validationSchema = yup.object().shape({
  login: yup.string().email('Некорректный email адрес').required('Введите адрес электронной почты'),
  password: yup.string().required('Введите пароль'),
});

const LoginForm = () => {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const router = useRouter();
  const logger = useLogger();
  const { setUser } = useUser();

  const formik = useFormik({
    initialValues: {
      login: '',
      password: '',
    },
    validationSchema,
    onSubmit: async values => {
      try {
        const { data } = await login(values);
        setUser(data);
        localStorage.setItem('token', data.token);
        await router.push('/desks');
      } catch (err) {
        logger.error(err);
      }
    },
  });

  const handleShowPassword = () => setIsShowPassword(prev => !prev);

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
            label="Логин"
            isInvalid={!!formik.errors.login && formik.touched.login}
            errorMessage={formik.errors.login}
            {...formik.getFieldProps('login')}
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
            Войти
          </Button>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;

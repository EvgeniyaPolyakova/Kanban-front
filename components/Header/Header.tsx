import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import Logo from '../../assets/icons/logo.svg';
import { useUser } from '../../hooks/useUser';
import Avatar from '../Avatar';
import s from './Header.module.scss';

export function Header() {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false);
  const { user, setUser } = useUser();
  const router = useRouter();

  const handleClickAvatar = () => {
    setIsUserMenuOpen(prev => !prev);
  };

  const handleClickLogout = () => {
    setUser(null);
    router.push('/');
  };

  return (
    <>
      <header className={s.header}>
        <Link href="/">
          <a>
            <Logo />
          </a>
        </Link>
        {user ? (
          <Avatar name={`${user.name} ${user.surname}`} classname={s.userAvatar} onClick={handleClickAvatar} />
        ) : (
          <div className={s.btnsContainer}>
            <Link href="/register">
              <a className={s.headerBtn}>Зарегистрироваться</a>
            </Link>
            <Link href="/login">
              <a className={s.headerBtn}>Войти</a>
            </Link>
          </div>
        )}
      </header>
      {isUserMenuOpen && (
        <div className={s.userMenu}>
          <button className={s.logout} onClick={handleClickLogout}>
            Выйти
          </button>
        </div>
      )}
    </>
  );
}

import Link from "next/link";
import React from "react";
import Logo from "../../assets/icons/logo.svg";
import s from "./Header.module.scss";

export function Header() {
  return (
    <header className={s.header}>
      <Link href="/">
        <a>
          <Logo />
        </a>
      </Link>
      <div className={s.btnsContainer}>
        <Link href="/register">
          <a className={s.headerBtn}>Зарегистрироваться</a>
        </Link>
        <Link href="/login">
          <a className={s.headerBtn}>Войти</a>
        </Link>
      </div>
    </header>
  );
}

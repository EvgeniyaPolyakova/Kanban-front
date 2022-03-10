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
        <button className={s.headerBtn} type="button">
          Зарегистрироваться
        </button>
        <button className={s.headerBtn} type="button">
          Войти
        </button>
      </div>
    </header>
  );
}

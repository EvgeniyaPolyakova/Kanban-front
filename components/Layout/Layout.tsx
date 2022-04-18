import React from 'react';
import { Header } from '../Header';
import s from './Layout.module.scss';

interface Props {
  children: React.ReactNode;
}

export function Layout({ children }: Props) {
  return (
    <>
      <Header />
      <main className={s.main}>{children}</main>
    </>
  );
}

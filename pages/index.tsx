import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { Header } from '../components/Header';
import styles from '../styles/Home.module.scss';
import Title from '../assets/images/kanban.svg';
import Button from '../components/Button';
import { useState } from 'react';
import Modal from '../components/Modal/Modal';
import LoginForm from '../components/LoginForm';
import Link from 'next/link';
import { Layout } from '../components/Layout';

const Home: NextPage = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head> */}
      <Layout>
        {/* <Header />
      <main className={styles.main}> */}
        <div className={styles.mainContent}>
          <Title />
          <p className={styles.title}>
            помогает командам эффективно <br />
            решать рабочие задачия
          </p>
          <Link href="/login">
            <a className={styles.link}>Авторизоваться</a>
          </Link>
        </div>
      </Layout>
      {/* </main> */}
    </>
  );
};

export default Home;

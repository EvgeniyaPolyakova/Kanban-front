import '../styles/base.scss';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;

  //Добавить модалку
  //В компоненте модалки Контекст

  //При открытии модалки роутер push
  //В модалке авторизации эффект
}

export default MyApp;

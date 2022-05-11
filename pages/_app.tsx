import '../styles/base.scss';
import type { AppProps } from 'next/app';
import { UserContextProvider } from '../contexts/UserContext';
import { useState } from 'react';
import { User } from '../interfaces/user';
import useInitializeUser from '../hooks/useInitializeUser';

function MyApp({ Component, pageProps }: AppProps) {
  const [user, setUser] = useState<User | null>(null);
  useInitializeUser(setUser);

  return (
    <UserContextProvider value={{ user, setUser }}>
      <Component {...pageProps} />
    </UserContextProvider>
  );
}

export default MyApp;

import '../styles/base.scss';
import type { AppProps } from 'next/app';
import { UserContextProvider } from '../contexts/UserContext';
import { useState } from 'react';
import { User } from '../interfaces/user';

function MyApp({ Component, pageProps }: AppProps) {
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserContextProvider value={{ user, setUser }}>
      <Component {...pageProps} />
    </UserContextProvider>
  );
}

export default MyApp;

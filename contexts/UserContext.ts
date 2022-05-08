import React from 'react';
import { User } from '../interfaces/user';

interface UserContextValue {
  user: User | null;
  setUser: (user: User | null) => void;
}

const UserContext = React.createContext<UserContextValue>({ user: null, setUser: () => {} });

export const UserContextProvider = UserContext.Provider;

export default UserContext;

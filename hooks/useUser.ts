import { LoginDto, RegisterDto } from '../api/dto/userDto';
import { register } from '../api/register';
import { login } from '../api/login';
import { useContext } from 'react';
import UserContext from '../contexts/UserContext';

export function useUser() {
  const { user, setUser } = useContext(UserContext);

  const getToken = async (data: RegisterDto) => {
    const { data: user } = await register(data);
    setUser(user);
  };

  const enter = async (data: LoginDto) => {
    const { data: user } = await login(data);
    setUser(user);
  };

  return { getToken, enter, user };
}

import { LoginDto, RegisterDto } from '../api/dto/userDto';
import { register } from '../api/register';
import { login } from '../api/login';

export function useUser() {
  const getToken = async (data: RegisterDto) => {
      return await register(data);
  };

  const enter = async (data: LoginDto) => {
    await login(data);
  };

  return { getToken, enter };
}

import { LoginDto } from './dto/userDto';
import makeRequest from './makeRequest';

export const login = (data: LoginDto) => {
  return makeRequest.post('/auth/login', {
    email: data.login,
    password: data.password,
  });
};

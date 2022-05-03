import { RegisterDto } from './dto/userDto';
import makeRequest from './makeRequest';

export const getAllUser = () => {
  return makeRequest.get('/users/get-all-users');
};

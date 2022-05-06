import { RegisterDto } from './dto/userDto';
import makeRequest from './makeRequest';

export const getAllUser = () => {
  return makeRequest.get('/users/get-all-users');
};

export const saveExecutor = (executorData: { cardId: number; userId: number; deskId: number }) => {
  return makeRequest.post('/users/select-executor', {
    cardId: executorData.cardId,
    userId: executorData.userId,
    deskId: executorData.deskId,
  });
};

export const getExecutorsList = (cardId: number) => {
  return makeRequest.get(`/users/executors-list/${cardId}`);
};

import makeRequest from './makeRequest';

export const getMyUser = () => {
  return makeRequest.get('/auth/my-user');
};

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

export const deleteExecutor = (executorId: number) => {
  return makeRequest.delete(`/users/delete-executor/${executorId}`);
};

export const deleteExecutors = (cardId: number) => {
  return makeRequest.delete(`/users/delete-executors/${cardId}`);
};

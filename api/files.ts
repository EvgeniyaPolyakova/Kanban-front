import { AxiosResponse } from 'axios';
import { CardFiles } from '../interfaces/card';
import makeRequest from './makeRequest';

export const uploadFiles = (cardId: number, data: FormData): Promise<AxiosResponse<CardFiles>> => {
  console.log(data);

  return makeRequest.post(`/files/upload/${cardId}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// export const getDesksList = (userId: number) => {
//   return makeRequest.get(`/get-desks/${userId}`);
// };
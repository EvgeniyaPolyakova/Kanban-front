import { CreateDeskDto } from './dto/deskDto';
import makeRequest from './makeRequest';

export const createDesk = (data: CreateDeskDto) => {
  return makeRequest.post('/create-desk', {
    userId: data.userId,
    name: data.name,
  });
};

export const getDesksList = (userId: number) => {
  return makeRequest.get(`/get-desks/${userId}`);
};

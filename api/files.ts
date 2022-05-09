import { AxiosResponse } from 'axios';
import { CardFiles } from '../interfaces/card';
import makeRequest from './makeRequest';

export const uploadFiles = (cardId: number, data: FormData): Promise<AxiosResponse<CardFiles>> => {
  return makeRequest.post(`/files/upload/${cardId}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const deleteFilesItem = (fileId: number) => {
  return makeRequest.delete(`/files/delete-file/${fileId}`);
};

export const deleteFiles = (cardId: number) => {
  return makeRequest.delete(`/files/delete-all-files/${cardId}`);
};

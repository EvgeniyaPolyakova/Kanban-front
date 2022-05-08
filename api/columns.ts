import { AxiosResponse } from 'axios';
import { DeskColumn } from '../interfaces/desk';
import { CreateColumnDto } from './dto/columnDto';
import makeRequest from './makeRequest';

export const createColumn = (data: CreateColumnDto): Promise<AxiosResponse<DeskColumn>> => {
  return makeRequest.post('/columns/add-column', {
    deskId: data.deskId,
    name: data.name,
    number: data.number,
  });
};

export const getColumns = (deskId: number): Promise<AxiosResponse<DeskColumn[]>> => {
  return makeRequest.get(`/columns/get-columns/${deskId}`);
};

export const renameColumn = (columnData: { id: number; name: string }) => {
  return makeRequest.post('columns/rename', {
    id: columnData.id,
    name: columnData.name,
  });
};

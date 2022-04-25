import { AxiosResponse } from 'axios';
import { CardChecklist } from '../interfaces/checklist';
import { DeskColumn } from '../interfaces/desk';
import { ChecklistDto } from './dto/checklistDto';
import makeRequest from './makeRequest';

export const createTask = (data: ChecklistDto): Promise<AxiosResponse<CardChecklist>> => {
  return makeRequest.post('/checklists/save-task', {
    task: data.task,
    isChecked: data.isChecked,
    cardId: data.cardId,
  });
};

export const getTasks = (cardId: number) => {
  return makeRequest.get(`/checklists/get-tasks/${cardId}`);
};

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

export const toggleComplited = (checlistData: { id: number; isChecked: boolean }) => {
  return makeRequest.post('/checklists/update-complited', {
    id: checlistData.id,
    isChecked: checlistData.isChecked,
  });
};

export const deleteChecklistItem = (taskId: number) => {
  return makeRequest.delete(`/checklists/delete-task/${taskId}`);
};

export const deleteChecklist = (cardId: number) => {
  return makeRequest.delete(`/checklists/delete-all-tasks/${cardId}`);
};

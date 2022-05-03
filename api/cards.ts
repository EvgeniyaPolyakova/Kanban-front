import { AxiosResponse } from 'axios';
import { CardInterface } from '../interfaces/card';
import { DeskColumn } from '../interfaces/desk';
import { CreateCardDto } from './dto/cardDto';
import makeRequest from './makeRequest';

export const createCard = (data: CreateCardDto): Promise<AxiosResponse<CardInterface>> => {
  return makeRequest.post('/cards/create-card', {
    columnId: data.columnId,
    title: data.title,
    userId: data.userId,
    number: data.number,
    // description: data.description,
    // deadline: data.deadline,
  });
};

export const getCards = (columnId: number): Promise<AxiosResponse<CardInterface>> => {
  return makeRequest.get(`/cards/get-cards/${columnId}`);
};

export const getCardById = (cardId: number): Promise<AxiosResponse<CardInterface>> => {
  return makeRequest.get(`/cards/get-card/${cardId}`);
};

export const updateCardNumber = (cardData: { id: number; number: number; columnId: number }) => {
  return makeRequest.post('/cards/update-number', {
    id: cardData.id,
    number: cardData.number,
    columnId: cardData.columnId,
  });
};

export const saveTitle = (cardTitle: { id: number; title: string }) => {
  return makeRequest.post('/cards/save-title', {
    id: cardTitle.id,
    title: cardTitle.title,
  });
};

export const saveDescription = (cardDescription: { id: number; description: string }) => {
  return makeRequest.post('/cards/save-description', {
    id: cardDescription.id,
    description: cardDescription.description,
  });
};

export const saveDeadline = (cardData: { id: number; deadline: Date }) => {
  return makeRequest.post('/cards/save-deadline', {
    id: cardData.id,
    deadline: cardData.deadline,
  });
};

export const toggleIsCompleted = (cardData: { id: number; isComplited: boolean }) => {
  return makeRequest.post('/cards/set-card-completed', {
    id: cardData.id,
    isComplited: cardData.isComplited,
  });
};

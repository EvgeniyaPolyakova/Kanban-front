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

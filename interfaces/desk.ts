import { CardInterface } from './card';

export interface DeskColumn {
  id: number;
  name: string;
  cards: CardInterface[];
}

export interface DeskCard {
  id: number;
  title: string;
}
export interface Desk {
  id: number;
  name: string;
}

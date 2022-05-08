import { CardChecklist } from './checklist';
import { User } from './user';

export interface CardInterface {
  id: number;
  columnId: number;
  userId?: number;
  number: number;
  title: string;
  description: string;
  deadline?: string | null;
  isComplited: boolean;
  checklists: CardChecklist[];
  comments: Comment[];
  files: CardFiles[];
}

export interface Comment {
  id: number;
  author: string;
  createdAt: string;
  text: string;
  users: User;
}

export interface CardFiles {
  id: number;
  fileName: string;
  binaryData: string;
  cardId: number;
}

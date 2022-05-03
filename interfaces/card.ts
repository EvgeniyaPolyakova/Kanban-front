import { CardChecklist } from './checklist';

export interface CardInterface {
  id: number;
  columnId: number;
  userId?: number;
  number: number;
  title: string;
  description?: string | null;
  deadline?: string | null;
  isComplited?: boolean | null;
  checklists?: CardChecklist[];
  comments?: Comment[];
  files?: CardFiles[];
}

// export interface CardChecklist {
//   id: number;
//   task: string;
//   completed: boolean;
// }

export interface Comment {
  id: number;
  author: string;
  date: string;
  text: string;
}

export interface CardFiles {
  id: number;
  fileName: string;
  binaryData: string;
  cardId: number;
}

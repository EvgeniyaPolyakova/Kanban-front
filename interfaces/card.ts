import { CardChecklist } from './checklist';

export interface CardInterface {
  id: number;
  columnId: number;
  userId?: number;
  number: number;
  title: string;
  description?: string | null;
  deadline?: Date | null;
  checklists?: CardChecklist[];
  comments?: Comment[];
  files?: File[];
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

export interface File {
  id: number;
  fileName: string;
  binaryData: BinaryData;
  cardId: number;
}

export interface CardChecklist {
  id: number;
  task: string;
  completed: boolean;
}

export interface Comment {
  id: number;
  author: string;
  date: string;
  text: string;
}

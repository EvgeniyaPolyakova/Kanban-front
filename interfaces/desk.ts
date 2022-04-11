export interface DeskColumn {
  id: number;
  title: string;
  cards: DeskCard[];
}

export interface DeskCard {
  id: number;
  title: string;
}

export interface CreateColumnDto {
  deskId: number;
  name: string;
  number: number;
}

export interface ColumnDto {
  id: number;
  name: string;
  number: number;
  deskId: number;
}

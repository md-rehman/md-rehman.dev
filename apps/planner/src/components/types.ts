export interface CardData {
  id: string;
  title: string;
  description: string;
  color: string;
  parentId?: string;
}

export interface ColumnData {
  id: string;
  title: string;
  cards: CardData[];
}

export interface BoardData {
  columns: ColumnData[];
}

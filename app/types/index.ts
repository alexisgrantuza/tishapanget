export interface BoardData {
  title: string;
  background?: string;
  isPrivate?: boolean;
}

export interface Card {
  id: string;
}

export interface List {
  id: string;
  name: string;
  position: number;
  cards: Card[];
}

export interface Board {
  id: string;
  name: string;
  description: string | null;
  color: string;
  isPrivate: boolean;
  ownerId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  owner?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    username: string;
  };
  lists: List[];
  _count?: {
    lists: number;
    members: number;
  };
}

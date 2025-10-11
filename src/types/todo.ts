export type Filter = "all" | "active" | "completed";

export interface Todo {
  id: number; 
  text: string; 
  completed: boolean; 
  createdAt: string; 
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

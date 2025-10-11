import axios from "axios";
import type { Filter, Todo, PaginatedResponse } from "../types/todo";

const api = axios.create({
  baseURL: "http://localhost:3001",
  timeout: 10000,
});

export interface FetchTodosParams {
  page: number;
  limit: number;
  filter: Filter;
}

export async function fetchTodos(params: FetchTodosParams) {
  const { page, limit, filter } = params;
  const { data } = await api.get<PaginatedResponse<Todo>>("/todos", {
    params: { page, limit, filter },
  });

  return data;
}

export async function createTodo(text: string) {
  const { data } = await api.post("/todos", { text, completed: false });

  return data;
}

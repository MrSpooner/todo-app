import { API_BASE_URL } from "../../config/api";
import { fetchWithAuth } from "../../utils/apiClient";

export interface Todo {
  id: string;
  userId: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

export interface PaginatedResponse {
  data: Todo[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export async function fetchTodos(
  page: number = 1,
  limit: number = 10,
  filter: "all" | "active" | "completed" = "all"
): Promise<PaginatedResponse> {
  const response = await fetchWithAuth(
    `${API_BASE_URL}/todos?page=${page}&limit=${limit}&filter=${filter}`
  );
  return await response.json();
}

export async function createTodo(text: string): Promise<Todo> {
  const response = await fetchWithAuth(`${API_BASE_URL}/todos`, {
    method: "POST",
    body: JSON.stringify({ text }),
  });
  return await response.json();
}

export async function updateTodo(
  id: string,
  text: string,
  completed: boolean
): Promise<Todo> {
  const response = await fetchWithAuth(`${API_BASE_URL}/todos/${id}`, {
    method: "PUT",
    body: JSON.stringify({ text, completed }),
  });
  return await response.json();
}

export async function deleteTodo(id: string): Promise<void> {
  await fetchWithAuth(`${API_BASE_URL}/todos/${id}`, {
    method: "DELETE",
  });
}

export async function toggleTodo(id: string): Promise<Todo> {
  const response = await fetchWithAuth(`${API_BASE_URL}/todos/${id}/toggle`, {
    method: "PATCH",
  });
  return await response.json();
}


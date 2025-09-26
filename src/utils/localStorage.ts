import type { Todo } from "../types/index";

const storageKey = "todoStorage";

export function getTodos(): Todo[] {
  const data = localStorage.getItem("storageKey");
  return data ? JSON.parse(data) : [];
}

export function saveTodos(todos: Todo[]): void {
  localStorage.setItem(storageKey, JSON.stringify(todos));
}

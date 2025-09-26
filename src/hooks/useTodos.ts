import { useState, useEffect } from "react";
import { saveTodos, getTodos } from "../utils/localStorage";
import type { Todo } from "../types/index";

export default function useTodos() {
  const [todos, setTodos] = useState<Todo[]>(() => getTodos());

  useEffect(() => {
    saveTodos(todos);
  }, [todos]);

  const addTodo = (text: string) => {
    const newTodo = {
      id: Date.now(),
      text,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    setTodos((prev) => [newTodo, ...prev]);
  };

  const removeTodo = (id: number) => {
    setTodos((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleTodo = (id: number) => {
    setTodos((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const editTodo = (id:number, text: string) => {
        setTodos((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, text } : item
      )
    );
  }

  return { todos, addTodo, removeTodo, toggleTodo, editTodo };
}

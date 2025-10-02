import React, { useState, useMemo } from "react";
import { AddTodo } from "./components/AddTodo/AddTodo";
import useTodos from "./hooks/useTodos";
import TodoList from "./components/TodoList/TodoList";
import { Controls } from "./components/Controls/Controls";
import { useTheme } from "./context/ThemeContext";

function App() {
  const { todos, addTodo, removeTodo, toggleTodo, editTodo } = useTodos();
  const [filter, setFilter] = useState<"all" | "done" | "active">("all");
  const [sortOrder, setSortOrder] = useState<"old" | "new">("new");
  const { theme, toggle } = useTheme();

  const visibleTodos = useMemo(() => {
    let list = todos.filter((item) => {
      let res;

      if (filter === "all") {
        res = true;
      } else if (filter === "done") {
        res = item.completed;
      } else {
        res = !item.completed;
      }

      return res;
    });

    list = [...list].sort((a, b) => {
      const A = new Date(a.createdAt).getTime();
      const B = new Date(b.createdAt).getTime();

      return sortOrder === "new" ? B - A : A - B;
    });

    return list;
  }, [todos, filter, sortOrder]);

  return (
    <div style={{ maxWidth: 860, margin: "24px auto", padding: 12 }}>
      <header
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 12,
        }}
      >
        <h1 style={{ margin: 0, fontSize: 20 }}>Todo App</h1>
        <div style={{ marginLeft: "auto" }}>
          <button onClick={toggle}>
            Тема: {theme === "light" ? "Светлая" : "Тёмная"}
          </button>
        </div>
      </header>

      <div
        style={{
          maxWidth: 720,
          margin: "24 auto",
          padding: 12,
        }}
      >
        <h1>Todo App</h1>
        <Controls
          filter={filter}
          setFilter={setFilter}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
        />
        <AddTodo onAdd={(text) => addTodo(text)} />
        <TodoList
          todos={visibleTodos}
          onToggle={toggleTodo}
          onRemove={removeTodo}
          onEdit={editTodo}
        />
      </div>
    </div>
  );
}

export default App;

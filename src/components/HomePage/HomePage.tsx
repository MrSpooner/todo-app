import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { loadTodos, createTodoThunk, updateTodoThunk, deleteTodoThunk, toggleTodoThunk, setPage, setLimit, setFilter, setSortOrder } from "../../features/todos/todoSlice";
import { Header } from "../Header/Header";
import { AddTodo } from "../AddTodo/AddTodo";
import TodoList from "../TodoList/TodoList";
import { Controls } from "../Controls/Controls";
import Pages from "../Pages/Pages";

export function HomePage() {
  const d = useAppDispatch();
  const { items, status, error, page, limit, filter, totalPages, sortOrder } = useAppSelector((s) => s.todos);

  useEffect(() => {
    d(loadTodos());
  }, [d, page, limit, filter]);

  function handleAdd(text: string) {
    if (!text.trim()) {
      return { error: "Поле не может быть пустым" };
    }
    d(createTodoThunk(text.trim()));
  }

  function handleToggle(id: string) {
    d(toggleTodoThunk(id));
  }

  function handleRemove(id: string) {
    d(deleteTodoThunk(id));
  }

  function handleEdit(id: string, text: string) {
    const todo = items.find(t => t.id === id);
    if (todo) {
      d(updateTodoThunk({ id, text, completed: todo.completed }));
    }
  }

  function handlePageChange(newPage: number) {
    d(setPage(newPage));
  }

  function handleLimitChange(newLimit: number) {
    d(setLimit(newLimit));
  }

  function handleFilterChange(newFilter: "all" | "active" | "completed") {
    d(setFilter(newFilter));
  }

  function handleSortChange(newSort: "new" | "old") {
    d(setSortOrder(newSort));
  }

  const sortedItems = [...items].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortOrder === "new" ? dateB - dateA : dateA - dateB;
  });

  return (
    <div style={{ maxWidth: 560, margin: "24px auto", display: "grid", gap: 12 }}>
      <Header />
      <h2>Мои задачи</h2>

      <AddTodo onAdd={handleAdd} />

      <Controls
        filter={filter}
        setFilter={handleFilterChange}
        sortOrder={sortOrder}
        setSortOrder={handleSortChange}
      />

      {status === "loading" && <div>Загрузка…</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}

      <TodoList 
        todos={sortedItems}
        onToggle={handleToggle}
        onRemove={handleRemove}
        onEdit={handleEdit}
      />

      <Pages
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        limit={limit}
        onLimitChange={handleLimitChange}
      />
    </div>
  );
}


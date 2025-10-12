import React, { useEffect, useMemo, useState } from "react";
import { AddTodo } from "./components/AddTodo/AddTodo";
import TodoList from "./components/TodoList/TodoList";
import { Controls } from "./components/Controls/Controls";
import { useTheme } from "./context/ThemeContext";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import Pages from "./components/Pages/Pages";
import {
  AppContainer,
  Header,
  Title,
  Content,
  ThemeButton,
} from "./components/ui";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import {
  loadTodos,
  setPage,
  setLimit,
  setFilter as setApiFilter,
  createTodoThunk,
  deleteTodoThunk,
  toggleTodoThunk,
  updateTodoThunk,
} from "./store/todoSlice";

export default function App() {
  const d = useAppDispatch();
  const { theme, toggle } = useTheme();
  const {
    items,
    status,
    error,
    page,
    limit,
    totalPages,
    filter,
  } = useAppSelector((s) => s.todos);

  const [uiFilter, setUiFilter] = useState<"all" | "completed" | "active">(
    "all"
  );
  const [sortOrder, setSortOrder] = useState<"old" | "new">("new");

  const muiTheme = useMemo(
    () =>
      createTheme({
        palette: { mode: theme === "dark" ? "dark" : "light" },
      }),
    [theme]
  );

  useEffect(() => {
    setUiFilter(filter);
  }, [filter]);

  useEffect(() => {
    d(loadTodos({ page, limit, filter: filter }));
  }, [d, page, limit, filter]);

  const visibleTodos = useMemo(() => {
    const list = items;

    return [...list].sort((a, b) => {
      const A = new Date(a.createdAt).getTime();
      const B = new Date(b.createdAt).getTime();

      return sortOrder === "new" ? B - A : A - B;
    });
  }, [items, sortOrder]);

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />

      <AppContainer>
        <Header>
          <Title>Todo App</Title>
          <ThemeButton onClick={toggle}>
            Тема: {theme === "light" ? "Светлая" : "Тёмная"}
          </ThemeButton>
        </Header>

        <Content>
          <Controls
            filter={uiFilter}
            setFilter={(f) => d(setApiFilter(f))}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
          />

          <AddTodo
            onAdd={(text) => {
              const t = text.trim();
              if (!t) return alert("Поле не может быть пустым");
              d(createTodoThunk(t));
            }}
          />

          {status === "loading" && <i>Загрузка…</i>}
          {status === "failed" && (
            <span style={{ color: "crimson" }}>{error}</span>
          )}

          {status === "succeeded" && (
            <>
              <TodoList
                todos={visibleTodos}
                onToggle={(id, completed) =>
                  d(toggleTodoThunk({ id, completed }))
                }
                onRemove={(id) => d(deleteTodoThunk(id))}
                onEdit={(id, text) => d(updateTodoThunk({ id, text }))}
              />

              <Pages
                page={page}
                totalPages={totalPages}
                d={d}
                setPage={setPage}
                limit={limit}
                setLimit={setLimit}
              />
            </>
          )}
        </Content>
      </AppContainer>
    </ThemeProvider>
  );
}

import React, { useState, useMemo } from "react";
import { AddTodo } from "./components/AddTodo/AddTodo";
import useTodos from "./hooks/useTodos";
import TodoList from "./components/TodoList/TodoList";
import { Controls } from "./components/Controls/Controls";
import { useTheme } from "./context/ThemeContext";
import TodosPage from './ui/TodosPage';
import { AppContainer, Header, Title, Content, ThemeButton } from "./components/ui";

function App() {
  const { todos, addTodo, removeTodo, toggleTodo, editTodo } = useTodos();
  const [filter, setFilter] = useState<"all" | "done" | "active">("all");
  const [sortOrder, setSortOrder] = useState<"old" | "new">("new");
  const { theme, toggle } = useTheme();

  const visibleTodos = useMemo(() => {
    let list = todos.filter((item) => {
      if (filter === "all") return true;
      if (filter === "done") return item.completed;
      return !item.completed;
    });

    return [...list].sort((a, b) => {
      const A = new Date(a.createdAt).getTime();
      const B = new Date(b.createdAt).getTime();
      return sortOrder === "new" ? B - A : A - B;
    });
  }, [todos, filter, sortOrder]);

  return (
    // <AppContainer>
    //   <Header>
    //     <Title>Todo App</Title>
    //     <ThemeButton onClick={toggle}>
    //       Тема: {theme === "light" ? "Светлая" : "Тёмная"}
    //     </ThemeButton>
    //   </Header>

    //   <Content>
    //     <Controls
    //       filter={filter}
    //       setFilter={setFilter}
    //       sortOrder={sortOrder}
    //       setSortOrder={setSortOrder}
    //     />
    //     <AddTodo
    //       onAdd={(text) => {
    //         const trimmed = text.trim();
    //         if (!trimmed) return alert("Поле не может быть пустым");
    //         addTodo(trimmed);
    //       }}
    //     />
    //     <TodoList
    //       todos={visibleTodos}
    //       onToggle={toggleTodo}
    //       onRemove={removeTodo}
    //       onEdit={editTodo}
    //     />
    //   </Content>
    // </AppContainer>
    <TodosPage/>
  );
}

export default App;

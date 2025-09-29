import { AddTodo } from "./components/AddTodo/AddTodo";
import useTodos from "./hooks/useTodos";
import TodoList from "./components/TodoList/TodoList";

function App() {
  const { todos, addTodo, removeTodo, toggleTodo, editTodo } = useTodos();

  return (
    <div
      style={{
        maxWidth: 720,
        margin: "24 auto",
        padding: 12,
      }}
    >
      <h1>Todo App</h1>
      <AddTodo onAdd={(text) => addTodo(text)} />
      <TodoList
        todos={todos}
        onToggle={toggleTodo}
        onRemove={removeTodo}
        onEdit={editTodo}
      />
    </div>
  );
}

export default App;

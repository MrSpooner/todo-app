import type { Todo } from "../../features/todos/todosApi";
import { TodoItem } from "../TodoItem/TodoItem";
import { TodoUl } from "../ui";

type Props = {
  todos: Todo[];
  onToggle: (id: string, completed: boolean) => void;
  onRemove: (id: string) => void;
  onEdit: (id: string, text: string) => void;
};

export default function TodoList({ todos, onToggle, onRemove, onEdit }: Props) {
  return (
    <TodoUl>
      {todos.map((item) => (
        <TodoItem
          key={item.id}
          todo={item}
          onToggle={onToggle}
          onRemove={onRemove}
          onEdit={onEdit}
        />
      ))}
    </TodoUl>
  );
}

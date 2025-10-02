import type { Todo } from "../../types/index";
import { TodoItem } from "../TodoItem/TodoItem";
import { TodoUl } from "../ui";

type Props = {
  todos: Todo[];
  onToggle: (id: number) => void;
  onRemove: (id: number) => void;
  onEdit: (id: number, text: string) => void;
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

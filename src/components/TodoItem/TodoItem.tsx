import React, { useState, useEffect, useRef } from "react";
import type { Todo } from "../../types/index";

type Props = {
  todo: Todo;
  onToggle: (id: number) => void;
  onRemove: (id: number) => void;
  onEdit: (id: number, text: string) => void;
};

export function TodoItem({ todo, onToggle, onRemove, onEdit }: Props) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(todo.text);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const startEdit = () => {
    setEditing(true);
  };
  const cancel = () => {
    setEditing(false);
    setValue(todo.text);
  };
  const save = () => {
    onEdit(todo.id, value.trim());
    setEditing(false);
  };

  useEffect(() => {
    if (editing) {
      setValue(todo.text);
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing, todo.text]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      save();
    } else if (e.key === "Escape") {
      e.preventDefault();
      cancel();
    }
  };

  return (
    <li style={{ display: "flex", gap: 12, alignItems: "center", padding: 8 }}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      {editing ? (
        <div style={{ flex: 1 }}>
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKeyDown}
          />
        </div>
      ) : (
        <>
          <div style={{ flex: 1 }}>
            <div
              style={{
                textDecoration: todo.completed ? "line-through" : "none",
              }}
            >
              {todo.text}
            </div>
            <div style={{ fontSize: 12, color: "#666" }}>
              {new Date(todo.createdAt).toLocaleString()}
            </div>
          </div>
          <button onClick={startEdit}>Редактировать</button>
          <button onClick={() => onRemove(todo.id)}>Удалить</button>
        </>
      )}
    </li>
  );
}

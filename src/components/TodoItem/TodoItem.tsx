import React, { useState, useEffect, useRef } from "react";
import type { Todo } from "../../types/index";
import styled from "styled-components";
import { TodoLi, TodoInput, TodoText, SubText, TodoButton } from "../ui";

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

  const startEdit = () => setEditing(true);
  const cancel = () => {
    setEditing(false);
    setValue(todo.text);
  };
  const save = () => {
    if (value.trim()) {
      onEdit(todo.id, value.trim());
    }
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
    if (e.key === "Enter") save();
    if (e.key === "Escape") cancel();
  };

  return (
    <TodoLi>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      {editing ? (
        <TodoInput
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
        />
      ) : (
        <>
          <div style={{ flex: 1 }}>
            <TodoText completed={todo.completed}>{todo.text}</TodoText>
            <SubText>{new Date(todo.createdAt).toLocaleString()}</SubText>
          </div>
          <TodoButton onClick={startEdit}>Редактировать</TodoButton>
          <TodoButton onClick={() => onRemove(todo.id)}>Удалить</TodoButton>
        </>
      )}
    </TodoLi>
  );
}

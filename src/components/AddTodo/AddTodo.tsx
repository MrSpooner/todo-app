import React, { useState } from "react";

type Props = {
  onAdd: (text: string) => { error?: string | null } | void;
};

export const AddTodo = ({ onAdd }: Props) => {
  const [text, setText] = useState("");

  const submit = () => {
    const trimmed = text.trim();

    onAdd(trimmed);
    setText("");
  };

  return (
    <div
      style={{
        display: "flex",
        gap: 8,
        marginBottom: 12,
      }}
    >
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            submit();
          }
        }}
        placeholder="Новая задача"
        style={{ flex: 1, padding: 8 }}
      />
      <button onClick={submit}>Добавить</button>
    </div>
  );
};

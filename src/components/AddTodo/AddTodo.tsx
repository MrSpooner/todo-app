import React, { useState } from "react";
import { Row, Input, Button } from "../ui";

type Props = {
  onAdd: (text: string) => { error?: string | null } | void;
};

export const AddTodo = ({ onAdd }: Props) => {
  const [text, setText] = useState("");

  const submit = () => {
    const trimmed = text.trim();
    const res = onAdd(trimmed);
    if (res && res.error) return;
    setText("");
  };

  return (
    <Row>
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") submit();
        }}
        placeholder="Новая задача"
      />
      <Button onClick={submit}>Добавить</Button>
    </Row>
  );
};

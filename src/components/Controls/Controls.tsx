import React from "react";
import { ControlsContainer, RadioGroup, Label, SortButton } from "../ui";

type Props = {
  filter: "all" | "completed" | "active";
  setFilter: (f: "all" | "completed" | "active") => void;
  sortOrder: "new" | "old";
  setSortOrder: (s: "new" | "old") => void;
};

export const Controls = ({
  filter,
  setFilter,
  sortOrder,
  setSortOrder,
}: Props) => {
  return (
    <ControlsContainer>
      <RadioGroup>
        <Label active={filter === "all"}>
          <input
            type="radio"
            checked={filter === "all"}
            onChange={() => setFilter("all")}
            style={{ marginRight: 4 }}
          />
          Все
        </Label>

        <Label active={filter === "completed"}>
          <input
            type="radio"
            checked={filter === "completed"}
            onChange={() => setFilter("completed")}
            style={{ marginRight: 4 }}
          />
          Готовые
        </Label>

        <Label active={filter === "active"}>
          <input
            type="radio"
            checked={filter === "active"}
            onChange={() => setFilter("active")}
            style={{ marginRight: 4 }}
          />
          Неготовые
        </Label>
      </RadioGroup>

      <div style={{ display: "flex", gap: 8 }}>
        <SortButton
          active={sortOrder === "new"}
          onClick={() => setSortOrder("new")}
          disabled={sortOrder === "new"}
        >
          Новые
        </SortButton>
        <SortButton
          active={sortOrder === "old"}
          onClick={() => setSortOrder("old")}
          disabled={sortOrder === "old"}
        >
          Старые
        </SortButton>
      </div>
    </ControlsContainer>
  );
};

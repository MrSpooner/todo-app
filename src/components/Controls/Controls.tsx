import React from "react";

type Props = {
  filter: "all" | "done" | "active";
  setFilter: (f: "all" | "done" | "active") => void;
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
    <div>
      <div>
        <label>
          <input
            type="radio"
            checked={filter === "all"}
            onChange={() => {
              setFilter("all");
            }}
          />{" "}
          Все
        </label>

        <label>
          <input
            type="radio"
            checked={filter === "done"}
            onChange={() => {
              setFilter("done");
            }}
          />{" "}
          Готовые
        </label>

        <label>
          <input
            type="radio"
            checked={filter === "active"}
            onChange={() => {
              setFilter("active");
            }}
          />{" "}
          Неготовые
        </label>
      </div>

      <div>
        <button
          onClick={() => setSortOrder("new")}
          disabled={sortOrder === "new"}
        >
          Новые
        </button>
        <button
          onClick={() => setSortOrder("old")}
          disabled={sortOrder === "old"}
        >
          Старые
        </button>
      </div>
    </div>
  );
};

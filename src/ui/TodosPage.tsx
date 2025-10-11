import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { loadTodos, setPage, setLimit, setFilter } from "../store/todoSlice";
import { useState } from 'react';
import { createTodoThunk } from '../store/todoSlice';

export default function TodoPage() {
  const d = useAppDispatch();
  const { items, status, error, page, limit, totalPages, filter } =
    useAppSelector((s) => s.todos);
    console.log('render', { page, limit, filter, status, items });


  useEffect(() => {
    d(loadTodos({ page, limit, filter }));
    console.log('loadTodos call', { page, limit, filter });
  }, [d, page, limit, filter]);

  return (
    <div style={{ maxWidth: 720, margin: "24px auto", padding: 16 }}>
      <h1>Todos</h1>

      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <button disabled={filter === "all"} onClick={() => d(setFilter("all"))}>
          All
        </button>
        <button
          disabled={filter === "active"}
          onClick={() => d(setFilter("active"))}
        >
          Active
        </button>
        <button
          disabled={filter === "completed"}
          onClick={() => d(setFilter("completed"))}
        >
          Completed
        </button>

        <select
          value={limit}
          onChange={(e) => d(setLimit(Number(e.target.value)))}
        >
          {[1, 5, 10, 20].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>

      {status === "loading" && <p>Загрузка…</p>}
      {status === "failed" && <p style={{ color: "crimson" }}>{error}</p>}
      {status === "succeeded" && (
        <>
          {items.length === 0 ? (
            <i>Пусто</i>
          ) : (
            <ul>
              {items.map((t) => (
                <li key={t.id}>
                  {t.text} {t.completed ? "✅" : ""}
                </li>
              ))}
            </ul>
          )}
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button disabled={page <= 1} onClick={() => d(setPage(page - 1))}>
              Prev
            </button>
            <span>
              {page} / {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => d(setPage(page + 1))}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

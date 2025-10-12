import Pagination from "@mui/material/Pagination";
import type { RootState, AppDispatch } from "../../store/index";
import type { JSX } from "react";
import type { PayloadAction } from "@reduxjs/toolkit";

type PagesProps = {
  page: number;
  totalPages: number;
  d: AppDispatch;
  setPage: (page: number) => PayloadAction<number>;
  limit: number;
  setLimit: (limit: number) => PayloadAction<number>;
};

export default function Pages({
  page,
  totalPages,
  d,
  setPage,
  limit,
  setLimit,
}: PagesProps): JSX.Element {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginTop: 16,
      }}
    >
      <Pagination
        page={page}
        count={Math.max(totalPages, 1)}
        onChange={(_, p) => d(setPage(p))}
        shape="rounded"
      />

      <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
        На странице:
        <select
          value={limit}
          onChange={(e) => d(setLimit(Number(e.target.value)))}
        >
          {[5, 10, 20].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

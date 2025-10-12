import Pagination from "@mui/material/Pagination";
import type { JSX } from "react";

type PagesProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  limit: number;
  onLimitChange: (limit: number) => void;
};

export default function Pages({
  page,
  totalPages,
  onPageChange,
  limit,
  onLimitChange,
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
        onChange={(_, p) => onPageChange(p)}
        shape="rounded"
      />

      <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
        На странице:
        <select
          value={limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
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

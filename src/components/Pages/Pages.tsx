import Pagination from "@mui/material/Pagination";
import type { JSX } from "react";
import { useTheme } from "../../context/ThemeContext";

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
  const { theme } = useTheme();
  const isDark = theme === "dark";

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
        sx={{
          "& .MuiPaginationItem-root": {
            color: isDark ? "#e6eef8" : "#0f172a",
          },
          "& .MuiPaginationItem-icon": {
            color: isDark ? "#e6eef8" : "#0f172a",
          },
          "& .Mui-disabled": {
            color: isDark ? "#64748b" : "#94a3b8",
          },
        }}
      />

      <label style={{ display: "flex", alignItems: "center", gap: 6, color: isDark ? "#e6eef8" : "#0f172a" }}>
        На странице:
        <select
          value={limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
          style={{
            backgroundColor: isDark ? "#0f172a" : "#ffffff",
            color: isDark ? "#e6eef8" : "#0f172a",
            border: `1px solid ${isDark ? "#64748b" : "#cbd5e1"}`,
            borderRadius: "4px",
            padding: "4px 8px",
            cursor: "pointer",
          }}
        >
          {[5, 10, 20].map((n) => (
            <option key={n} value={n} style={{ backgroundColor: isDark ? "#0f172a" : "#ffffff", color: isDark ? "#e6eef8" : "#0f172a" }}>
              {n}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { logoutUserThunk } from "../../features/auth/authSlice";
import { useTheme } from "../../context/ThemeContext";
import { ThemeButton } from "../ui";

export function Header() {
  const d = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const navigate = useNavigate();
  const { theme, toggle } = useTheme();
  
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center" }}>
      <div>
        <a href="/">Задачи</a> &nbsp;|&nbsp; <a href="/profile">Профиль</a>
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <ThemeButton onClick={toggle}>
          {theme === "light" ? "🌙" : "☀️"}
        </ThemeButton>
        {user?.email} &nbsp;
        <button
          onClick={async () => {
            await d(logoutUserThunk());
            navigate("/login", { replace: true });
          }}
        >
          Выйти
        </button>
      </div>
    </div>
  );
}


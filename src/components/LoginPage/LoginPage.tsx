import { useState } from "react";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { loginUserThunk, fetchMeThunk } from "../../features/auth/authSlice";
import { getEmailError, getPasswordError } from "../../utils/validation";

export function LoginPage() {
  const d = useAppDispatch();
  const navigate = useNavigate();
  const token = useAppSelector((s) => s.auth.token);
  const loc = useLocation() as any;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (token) {
    return <Navigate to={loc.state?.from?.pathname || "/"} replace />;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    
    const emailError = getEmailError(email);
    if (emailError) {
      setErr(emailError);
      return;
    }
    
    const passwordError = getPasswordError(password);
    if (passwordError) {
      setErr(passwordError);
      return;
    }
    
    setLoading(true);
    try {
      await d(loginUserThunk({ email, password })).unwrap();
      await d(fetchMeThunk()).unwrap();
      navigate(loc.state?.from?.pathname || "/", { replace: true });
    } catch (e: any) {
      setErr(e?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 360, margin: "40px auto" }}>
      <h2>Вход</h2>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 8 }}>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Пароль" />
        {err && <div style={{ color: "red" }}>{err}</div>}
        <button disabled={loading}>Войти</button>
      </form>
      <div style={{ marginTop: 8 }}>
        Нет аккаунта? <a href="/register">Зарегистрироваться</a>
      </div>
    </div>
  );
}


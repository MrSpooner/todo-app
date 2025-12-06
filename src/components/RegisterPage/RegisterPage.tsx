import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../store/hooks";
import { registerUserThunk } from "../../features/auth/authSlice";
import { getEmailError, getPasswordError } from "../../utils/validation";

export function RegisterPage() {
  const d = useAppDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState<string>("");
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

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
    try {
      await d(registerUserThunk({ email, password, age: age ? Number(age) : undefined })).unwrap();
      setOk(true);
      setTimeout(() => navigate("/login"), 600);
    } catch (e: any) {
      setErr(e.message);
    }
  }

  return (
    <div style={{ maxWidth: 360, margin: "40px auto" }}>
      <h2>Регистрация</h2>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 8 }}>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Пароль (≥6)" />
        <input value={age} onChange={(e) => setAge(e.target.value)} placeholder="Возраст (опц.)" />
        {err && <div style={{ color: "red" }}>{err}</div>}
        {ok && <div style={{ color: "green" }}>Успех! Перенаправляю…</div>}
        <button>Зарегистрироваться</button>
      </form>
      <div style={{ marginTop: 8 }}>
        Уже есть аккаунт? <a href="/login">Войти</a>
      </div>
    </div>
  );
}


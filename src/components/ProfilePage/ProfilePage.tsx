import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { changePasswordThunk } from "../../features/auth/authSlice";
import { Header } from "../Header/Header";

export function ProfilePage() {
  const user = useAppSelector((s) => s.auth.user);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const d = useAppDispatch();

  async function changePass(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    if (newPassword.length < 6) return setMsg("Новый пароль ≥ 6");
    if (newPassword !== confirm) return setMsg("Подтверждение не совпадает");

    try {
      await d(changePasswordThunk({ oldPassword, newPassword })).unwrap();
      setMsg("Пароль обновлён");
    } catch (e: any){
      setMsg(e?.message || "Ошибка");
    }
  }

  return (
    <div style={{ maxWidth: 560, margin: "24px auto", display: "grid", gap: 12 }}>
      <Header />
      <h2>Профиль</h2>
      {user ? (
        <>
          <div><b>Email:</b> {user.email}</div>
          <div><b>Age:</b> {user.age ?? "—"}</div>
          <div><b>Registered:</b> {user.createdAt}</div>

          <h3>Смена пароля</h3>
          <form onSubmit={changePass} style={{ display: "grid", gap: 8, maxWidth: 360 }}>
            <input value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} type="password" placeholder="Старый пароль" />
            <input value={newPassword} onChange={(e) => setNewPassword(e.target.value)} type="password" placeholder="Новый пароль" />
            <input value={confirm} onChange={(e) => setConfirm(e.target.value)} type="password" placeholder="Подтверждение" />
            {msg && <div>{msg}</div>}
            <button>Обновить</button>
          </form>
        </>
      ) : (
        <div>Загрузка профиля…</div>
      )}
    </div>
  );
}


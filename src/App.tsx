import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAppDispatch } from "./store/hooks";
import { loadFromStorageThunk, fetchMeThunk } from "./features/auth/authSlice";
import { GlobalError } from "./components/GlobalError/GlobalError";
import { ProtectedRoute } from "./components/ProtectedRoute/ProtectedRoute";
import { HomePage } from "./components/HomePage/HomePage";
import { LoginPage } from "./components/LoginPage/LoginPage";
import { RegisterPage } from "./components/RegisterPage/RegisterPage";
import { ProfilePage } from "./components/ProfilePage/ProfilePage";
import { NotFoundPage } from "./components/NotFoundPage/NotFoundPage";

export default function App() {
  const d = useAppDispatch();

  useEffect(() => {
    d(loadFromStorageThunk());
    d(fetchMeThunk()).catch(() => {});
  }, [d]);

  return (
    <BrowserRouter>
      <GlobalError />
      <Routes>
        <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

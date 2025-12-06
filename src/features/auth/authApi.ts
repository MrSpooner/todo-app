import { API_BASE_URL } from "../../config/api";
import { fetchWithAuth, saveAuthTokens, getToken, getAuthTokens } from "../../utils/apiClient";

export interface User {
  id: string;
  email: string;
  age?: number;
  createdAt: string;
}

async function handleAuthResponse(response: Response, defaultError: string) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error((error as any).message || defaultError);
  }
  return await response.json();
}

export async function registerUser(data: { email: string; password: string; age?: number }) {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  
  const result = await handleAuthResponse(res, "Registration failed");
  saveAuthTokens(result.accessToken, result.refreshToken);
  
  return { 
    accessToken: result.accessToken, 
    refreshToken: result.refreshToken 
  };
}

export async function loginUser(data: { email: string; password: string }) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  
  const result = await handleAuthResponse(res, "Login failed");
  saveAuthTokens(result.accessToken, result.refreshToken);
  
  return { 
    accessToken: result.accessToken, 
    refreshToken: result.refreshToken 
  };
}

export async function fetchMe(): Promise<User> {
  const response = await fetchWithAuth(`${API_BASE_URL}/auth/me`);
  return await response.json();
}

export async function changePassword(data: { oldPassword: string; newPassword: string }) {
  const response = await fetchWithAuth(`${API_BASE_URL}/auth/change-password`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function logoutUser(refreshToken: string | null) {
  if (!refreshToken) {
    localStorage.removeItem("auth");
    return;
  }

  try {
    const token = getToken();
    if (token) {
      await fetchWithAuth(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        body: JSON.stringify({ refreshToken }),
      });
    }
  } catch (error) {
    console.error("Logout error:", error);
  }
  
  localStorage.removeItem("auth");
}

export function loadFromStorage(): { token: string | null; refreshToken: string | null } {
  return getAuthTokens();
}


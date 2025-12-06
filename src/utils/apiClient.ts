import { API_BASE_URL } from "../config/api";
import { showGlobalError } from "../components/GlobalError/GlobalError";

export function getToken(): string | null {
  const raw = localStorage.getItem("auth");
  if (!raw) return null;
  try {
    const { token } = JSON.parse(raw);
    return token || null;
  } catch {
    return null;
  }
}

export function getAuthTokens(): { token: string | null; refreshToken: string | null } {
  const raw = localStorage.getItem("auth");
  if (!raw) return { token: null, refreshToken: null };
  try {
    const { token, refreshToken } = JSON.parse(raw);
    return { token: token || null, refreshToken: refreshToken || null };
  } catch {
    return { token: null, refreshToken: null };
  }
}

export function saveAuthTokens(accessToken: string, refreshToken: string): void {
  const authData = { token: accessToken, refreshToken };
  localStorage.setItem("auth", JSON.stringify(authData));
}

async function refreshAccessToken(): Promise<string> {
  const { refreshToken } = getAuthTokens();
  if (!refreshToken) {
    throw new Error("No refresh token");
  }

  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    throw new Error("Failed to refresh token");
  }

  const { accessToken } = await response.json();
  saveAuthTokens(accessToken, refreshToken);

  return accessToken;
}

export async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = getToken();
  
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  let response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    try {
      const newToken = await refreshAccessToken();
      
      response = await fetch(url, {
        ...options,
        headers: {
          ...headers,
          Authorization: `Bearer ${newToken}`,
        },
      });
    } catch (refreshError) {
      localStorage.removeItem("auth");
      window.location.href = "/login";
      throw refreshError;
    }
  }

  if (!response.ok) {
    const errorMessage = 
      (await response.json().catch(() => ({})) as any)?.message || 
      response.statusText || 
      "Произошла ошибка при запросе к серверу";
    
    if (response.status >= 500) {
      showGlobalError(`Ошибка сервера: ${errorMessage}`);
    }
    
    throw new Error(errorMessage);
  }

  return response;
}


import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { User } from "./authApi";
import { registerUser, loginUser, fetchMe, changePassword, logoutUser, loadFromStorage } from "./authApi";

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  status: "idle" | "loading" | "failed";
}

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  status: "idle",
};

export const registerUserThunk = createAsyncThunk(
  "auth/register",
  async (data: { email: string; password: string; age?: number }) => {
    return await registerUser(data);
  }
);

export const loginUserThunk = createAsyncThunk(
  "auth/login",
  async (data: { email: string; password: string }) => {
    return await loginUser(data);
  }
);

export const fetchMeThunk = createAsyncThunk("auth/fetchMe", async () => {
  return await fetchMe();
});

export const changePasswordThunk = createAsyncThunk(
  "auth/changePassword",
  async (data: { oldPassword: string; newPassword: string }) => {
    return await changePassword(data);
  }
);

export const loadFromStorageThunk = createAsyncThunk("auth/loadFromStorage", async () => {
  return loadFromStorage();
});

export const logoutUserThunk = createAsyncThunk("auth/logout", async (_, { getState }) => {
  const state = getState() as { auth: AuthState };
  await logoutUser(state.auth.refreshToken);
  return null;
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(registerUserThunk.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(registerUserThunk.fulfilled, (state, action) => {
      state.status = "idle";
      state.token = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    });
    builder.addCase(registerUserThunk.rejected, (state) => {
      state.status = "failed";
    });

    builder.addCase(loginUserThunk.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(loginUserThunk.fulfilled, (state, action) => {
      state.status = "idle";
      state.token = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    });
    builder.addCase(loginUserThunk.rejected, (state) => {
      state.status = "failed";
      state.token = null;
      state.refreshToken = null;
    });

    builder.addCase(fetchMeThunk.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(fetchMeThunk.fulfilled, (state, action) => {
      state.status = "idle";
      state.user = action.payload;
    });
    builder.addCase(fetchMeThunk.rejected, (state) => {
      state.status = "failed";
      state.token = null;
      state.user = null;
      localStorage.removeItem("auth");
    });

    builder.addCase(loadFromStorageThunk.fulfilled, (state, action) => {
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
    });

    builder.addCase(changePasswordThunk.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(changePasswordThunk.fulfilled, (state) => {
      state.status = "idle";
    });
    builder.addCase(changePasswordThunk.rejected, (state) => {
      state.status = "failed";
    });

    builder.addCase(logoutUserThunk.fulfilled, (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.status = "idle";
    });
  },
});

export default authSlice.reducer;

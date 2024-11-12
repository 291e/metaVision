// app/store/slices/loginSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isLoggedIn: boolean;
  token: string | null;
}

const initialState: AuthState = {
  isLoggedIn: false,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logIn: (state, action: PayloadAction<string>) => {
      state.isLoggedIn = true;
      state.token = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("token", action.payload);
      }
    },
    logOut: (state) => {
      state.isLoggedIn = false;
      state.token = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
      }
    },
    loadToken: (state) => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (token) {
          state.isLoggedIn = true;
          state.token = token;
        }
      }
    },
  },
});

export const { logIn, logOut, loadToken } = authSlice.actions;
export default authSlice.reducer;

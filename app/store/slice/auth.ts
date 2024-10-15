import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface InitialState {
  token: string;
  isLoggedIn: boolean;
}

export const initialState: InitialState = {
  token: "",
  isLoggedIn: false,
};

export const authState = createSlice({
  name: "auth_state",
  initialState: initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    setLogin: (state) => {
      state.isLoggedIn = true;
    },
    setLogout: (state) => {
      state.isLoggedIn = false;
    },
    setResetToken: () => initialState,
  },
});

export const { setToken, setLogin, setLogout, setResetToken } =
  authState.actions;
export const selectAuthState = (state: RootState) => state.auth_state;

export default authState.reducer;

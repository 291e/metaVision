import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface InitialState {
  email: string;
  password: string;
  passwordConfirm: string;
  phone: string;
  company_place: string;
  company_name: string;
  bank: string;
  bank_account: string;
  code: string;
}

export const initialState: InitialState = {
  email: "",
  password: "",
  passwordConfirm: "",
  phone: "",
  company_place: `"회사 위치"`,
  company_name: `"회사 이름"`,
  bank: "",
  bank_account: "",
  code: "",
};

export const createUserState = createSlice({
  name: "create_user_state",
  initialState: initialState,
  reducers: {
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    setPassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload;
    },
    setPasswordConfirm: (state, action: PayloadAction<string>) => {
      state.passwordConfirm = action.payload;
    },
    setPhone: (state, action: PayloadAction<string>) => {
      state.phone = action.payload;
    },
    setCompanyName: (state, action: PayloadAction<string>) => {
      state.company_name = action.payload;
    },
    setCompanyPlace: (state, action: PayloadAction<string>) => {
      state.company_place = action.payload;
    },
    setBank: (state, action: PayloadAction<string>) => {
      state.bank = action.payload;
    },
    setBankAccount: (state, action: PayloadAction<string>) => {
      state.bank_account = action.payload;
    },
    setCode: (state, action: PayloadAction<string>) => {
      state.code = action.payload;
    },
    setFirstCreate: (
      state,
      action: PayloadAction<{
        email: string;
        password: string;
        passwordConfirm: string;
        phone: string;
      }>
    ) => {
      state.email = action.payload.email;
      state.phone = action.payload.phone;
      state.password = action.payload.password;
      state.passwordConfirm = action.payload.passwordConfirm;
    },
    setSecondCreate: (
      state,
      action: PayloadAction<{
        company_place: string;
        company_name: string;
      }>
    ) => {
      state.company_name = action.payload.company_name;
      state.company_place = action.payload.company_place;
    },
    setReset: () => initialState,
    setUserdata: (
      state,
      action: PayloadAction<{
        company_name: string;
        company_place: string;
        email: string;
        phone: string;
      }>
    ) => {
      state.company_name = action.payload.company_name;
      state.company_place = action.payload.company_place;
      state.email = action.payload.email;
      state.phone = action.payload.phone;
    },
  },
});

export const {
  setEmail,
  setPassword,
  setPasswordConfirm,
  setPhone,
  setCompanyName,
  setCompanyPlace,
  setBank,
  setBankAccount,
  setFirstCreate,
  setSecondCreate,
  setReset,
  setCode,
  setUserdata,
} = createUserState.actions;
export const selectCreateUserState = (state: RootState) =>
  state.create_user_state;

export default createUserState.reducer;

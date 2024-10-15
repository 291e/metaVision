import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface InitialState {
  profile_userInfo_modal: boolean;
  profile_resetPW_modal: boolean;
  profile_unregister_modal: boolean;
}

export const initialState: InitialState = {
  profile_userInfo_modal: false,
  profile_resetPW_modal: false,
  profile_unregister_modal: false,
};

export const bottomSheetState = createSlice({
  name: "bottom_sheet_state",
  initialState: initialState,
  reducers: {
    setProfileUserInfo: (state, action: PayloadAction<boolean>) => {
      state.profile_userInfo_modal = action.payload;
    },
    setProfileResetPW: (state, action: PayloadAction<boolean>) => {
      state.profile_resetPW_modal = action.payload;
    },
    setProfileUnregister: (state, action: PayloadAction<boolean>) => {
      state.profile_unregister_modal = action.payload;
    },
    setResetBottomSheet: () => initialState,
  },
});

export const {
  setProfileUserInfo,
  setProfileResetPW,
  setProfileUnregister,
  setResetBottomSheet,
} = bottomSheetState.actions;
export const selectBottomSheetState = (state: RootState) =>
  state.bottom_sheet_state;

export default bottomSheetState.reducer;

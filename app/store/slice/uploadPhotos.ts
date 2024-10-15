import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface InitialState {
  awsLocations: string[];
  nowUploading: boolean;
  uploadSheet: boolean;
}

export const initialState: InitialState = {
  awsLocations: [],
  nowUploading: false,
  uploadSheet: false,
};

export const uploadPhotoState = createSlice({
  name: "upload_photos_state",
  initialState: initialState,
  reducers: {
    setAWSLocations: (state, action: PayloadAction<string>) => {
      state.awsLocations.push(action.payload);
    },
    setUploading: (state, action: PayloadAction<boolean>) => {
      state.nowUploading = action.payload;
    },
    setUploadSheet: (state, action: PayloadAction<boolean>) => {
      state.uploadSheet = action.payload;
    },
    setResetUploadAll: () => initialState,
  },
});

export const {
  setAWSLocations,
  setUploading,
  setUploadSheet,
  setResetUploadAll,
} = uploadPhotoState.actions;
export const selectUploadPhotoState = (state: RootState) =>
  state.upload_photos_state;

export default uploadPhotoState.reducer;

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import uploadPhotoState from "./slice/uploadPhotos";
import createUserState from "./slice/createUser";
import bottomSheetState from "./slice/bottomSheetState";
import authState from "./slice/auth";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth_state"], // persist하고 싶은 슬라이스를 추가
};

const rootReducer = combineReducers({
  upload_photos_state: uploadPhotoState,
  create_user_state: createUserState,
  bottom_sheet_state: bottomSheetState,
  auth_state: authState,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
});

export default store;

export function getStoreWithState(preloadedState?: RootState) {
  return configureStore({ reducer: persistedReducer, preloadedState });
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);

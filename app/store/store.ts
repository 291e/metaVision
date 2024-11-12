import { configureStore } from "@reduxjs/toolkit";
import loginReducer, { loadToken } from "./slices/loginSlice";

const store = configureStore({
  reducer: {
    login: loginReducer,
  },
});

// store 생성 시 초기화 액션을 호출하여 상태를 로컬 스토리지와 동기화
store.dispatch(loadToken());

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

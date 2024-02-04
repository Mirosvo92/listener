import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { AxiosInstance } from 'axios';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { axiosInst } from 'src/services/api';
import { authReducer } from './slices/auth';
import { tokensReducer } from './slices/tokens/slice';

const entitiesReducer = combineReducers({
  tokens: tokensReducer,
});

const rootReducer = combineReducers({
  auth: authReducer,
  entities: entitiesReducer,
});

export interface ThunkConfig<T> {
  rejectValue: T;
  extra: ThunkExtraArg;
  state: RootState;
}

export interface ThunkExtraArg {
  api: AxiosInstance;
}

const extraArg: ThunkExtraArg = {
  api: axiosInst,
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: extraArg,
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

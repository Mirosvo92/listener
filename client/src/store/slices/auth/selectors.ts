import { RootState } from 'src/store';

export const getUser = (state: RootState) => state.auth.user;
export const getIsAuth = (state: RootState) => state.auth.isAuth;
export const getError = (state: RootState) => state.auth.error;
export const getStatus = (state: RootState) => state.auth.status;

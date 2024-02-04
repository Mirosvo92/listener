import { createSlice } from '@reduxjs/toolkit';
import { loginThunk } from './thunks';

interface InitState {
  accessToken: string;
  isAuth: boolean;
  user: any;
  status: 'init' | 'loading' | 'error';
  error: string | null;
}

const initialState: InitState = {
  accessToken: '',
  isAuth: false,
  user: {},
  status: 'init',
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setIsAuth: (state, action) => {
      state.isAuth = action.payload;
    },
    setUserData: (state, action) => {
      state.user = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    setToken: (state, action) => {
      state.accessToken = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        console.log('works fulfilled');

        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.status = 'init';
        state.isAuth = true;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.isAuth = false;
        state.user = {};
        state.status = 'error';
        state.error = action.payload as string;
      });
  },
});

export const authAtions = authSlice.actions;
export const authReducer = authSlice.reducer;

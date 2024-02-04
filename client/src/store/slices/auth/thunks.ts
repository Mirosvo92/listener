import { createAsyncThunk } from '@reduxjs/toolkit';
import { ethers } from 'ethers';
import { ThunkConfig } from 'src/store';

export const loginThunk = createAsyncThunk<any, any, ThunkConfig<string>>('auth/login', async (_: void, thunkApi) => {
  const { extra, rejectWithValue } = thunkApi;
  try {
    if (!window.ethereum) {
      return rejectWithValue('Pleas, install Metamask extension');
    }

    const { data } = await extra.api.get('/auth/nonce');

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();

    const message = `I am signing this message to prove my identity. Nonce: ${data.nonce}`;

    console.log(message);

    const signedMessage = await signer.signMessage(message);
    console.log(signedMessage);

    const loginData = { signedMessage, message, address };
    const { data: userData } = await extra.api.post('/auth/login', loginData);

    return userData;
  } catch (error: any) {
    if (error.code === 4001) {
      return rejectWithValue('Something went wrong while you signed');
    }
    return rejectWithValue(error.message);
  }
});

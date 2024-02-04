import axios from 'axios';

export const axiosInst = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
});

export const startListenNewPairs = () => {
  return axiosInst.get('/listener/bnb');
};

export const stopListenNewPairs = () => {
  return axiosInst.get('/stop-listener/bnb');
};

export const listenContractTransactions = (address: string) => {
  return axiosInst.get(`/listener/bnb-contract/${address}`);
};
export const stopListenContractTransactions = (address: string) => {
  return axiosInst.get(`/stop-listener/bnb-contract/${address}`);
};

export const getNounce = () => {
  return axiosInst.get('/auth/nonce');
};

export const login = (data: any) => {
  return axiosInst.post('/auth/login', data);
};

export const verify = () => {
  return axiosInst.get('/auth/verify');
};

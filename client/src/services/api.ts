import axios from 'axios';

const axiosInst = axios.create({
  baseURL: 'http://localhost:3000',
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

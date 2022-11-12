import { Web3Storage } from "web3.storage";

export const getAccessToken = () => {
    return process.env.REACT_APP_STORAGE_TOKEN || ""
  };

export const makeStorageClient = () => {
    return new Web3Storage({ token: getAccessToken() });
};
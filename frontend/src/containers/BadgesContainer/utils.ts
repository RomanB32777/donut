import { Web3Storage } from "web3.storage";

export const getAccessToken = () => {
    return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDE1QjI0NjllMDUzZDIwQjQxOTU3NzMyNDI2RkMxQTM0OUFjMzY4M0YiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjI0NTU4MjY2MTQsIm5hbWUiOiJDcnlwdG9Eb251dHpCYWRnZXMifQ.IJvBOZg_jXikP2_4GxiqdKRw8uRkBhVF7VGs--wtANc";
  };

export const makeStorageClient = () => {
    return new Web3Storage({ token: getAccessToken() });
};
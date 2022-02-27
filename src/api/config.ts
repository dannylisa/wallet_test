import axios, { AxiosRequestConfig, AxiosInstance } from "axios";

const HOST = ''


export const requestAPI = (): AxiosInstance => {
  const headers = {

  };
  const configs: AxiosRequestConfig = {
    headers,
  };

  const client = axios.create({
    baseURL: HOST,
    ...configs,
  });

  return client;
};
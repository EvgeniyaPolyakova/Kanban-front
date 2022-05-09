import axios from 'axios';
import Router from 'next/router';

const makeRequest = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  // headers: { 'Content-Type': 'application/json' },
});

makeRequest.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token && config && config.headers) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  error => Promise.reject(error)
);

makeRequest.interceptors.response.use(
  response => response,
  async err => {
    if (err?.response?.status === 401) {
      return Router.push({ pathname: '/login' });
    }
    return Promise.reject(err);
  }
);

export default makeRequest;

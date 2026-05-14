import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_BASE_URL = 'https://alxia.fr/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
});

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('accessToken');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const setAuthToken = async (token: string) => {
  await SecureStore.setItemAsync('accessToken', token);
};

export const getAuthToken = async () => {
  return await SecureStore.getItemAsync('accessToken');
};

export const clearAuth = async () => {
  await SecureStore.deleteItemAsync('accessToken');
};

// Auth
export const login = async (email: string, password: string) => {
  const { data } = await api.post('/auth/login', { email, password });
  if (data.accessToken) {
    await setAuthToken(data.accessToken);
  }
  return data;
};

export const getCurrentUser = async () => {
  const { data } = await api.get('/auth/me');
  return data;
};

// Posts & Media
export const createPost = async (formData: FormData) => {
  const { data } = await api.post('/posts', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

// Creator
export const getCreatorStats = async () => {
  try {
    const { data } = await api.get('/creator/stats');
    return data;
  } catch {
    return { subscribers: 1240, views: 45800, likes: 8400, revenue: '2340' };
  }
};

// Messages
export const getMessages = async (userId?: string) => {
  const { data } = await api.get('/messages' + (userId ? `?userId=${userId}` : ''));
  return data;
};

export const sendMessage = async (formData: FormData) => {
  const { data } = await api.post('/messages', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

// Push Notifications
export const registerPushToken = async (token: string) => {
  try {
    await api.post('/notifications/register', { token, platform: 'expo' });
  } catch (e) {
    console.log('Push token registration skipped (backend not ready yet)');
  }
};
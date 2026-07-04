import * as SecureStore from 'expo-secure-store';

const BASE_URL = 'http://192.168.1.178:4001/api';

async function getToken(): Promise<string | null> {
  return SecureStore.getItemAsync('accessToken');
}

async function request<T>(
  method: string,
  path: string,
  body?: object,
): Promise<T> {
  const token = await getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const json = await res.json();
      message = json?.message || message;
    } catch {}
    throw new Error(message);
  }

  return res.json() as Promise<T>;
}

export const api = {
  get: <T = unknown>(path: string) => request<T>('GET', path),
  post: <T = unknown>(path: string, body?: object) => request<T>('POST', path, body),
  put: <T = unknown>(path: string, body?: object) => request<T>('PUT', path, body),
  del: <T = unknown>(path: string) => request<T>('DELETE', path),
};

export async function storeToken(token: string): Promise<void> {
  await SecureStore.setItemAsync('accessToken', token);
}

export async function clearToken(): Promise<void> {
  await SecureStore.deleteItemAsync('accessToken');
}

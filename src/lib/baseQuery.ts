import { fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { handleApiError } from './apiErrorHandler';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001';

let isRefreshing = false;
let refreshQueue: Array<(token: string | null) => void> = [];

function notifyQueue(token: string | null) {
  refreshQueue.forEach((cb) => cb(token));
  refreshQueue = [];
}

async function attemptTokenRefresh(): Promise<string | null> {
  try {
    const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;
    const response = await fetch(`${BACKEND_URL}/api/v1/auth/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
      credentials: 'include',
    });
    if (!response.ok) return null;
    const data = await response.json();
    const newToken = data?.data?.accessToken;
    if (newToken && typeof window !== 'undefined') {
      localStorage.setItem('accessToken', newToken);
    }
    return newToken || null;
  } catch {
    return null;
  }
}

function clearAuthAndRedirect() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    window.location.href = '/auth/login';
  }
}

export const createBaseQuery = (basePath: string) => {
  const rawBaseQuery = fetchBaseQuery({
    baseUrl: `${BACKEND_URL}${basePath}`,
    prepareHeaders: (headers) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('accessToken');
        if (token) headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  });

  const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
  > = async (args, api, extraOptions) => {
    let result = await rawBaseQuery(args, api, extraOptions);

    if (result.error?.status === 401) {
      if (!isRefreshing) {
        isRefreshing = true;
        const newToken = await attemptTokenRefresh();
        isRefreshing = false;
        notifyQueue(newToken);

        if (!newToken) {
          clearAuthAndRedirect();
          return result;
        }
      } else {
        await new Promise<void>((resolve) => {
          refreshQueue.push(() => resolve());
        });
      }
      result = await rawBaseQuery(args, api, extraOptions);
    }

    if (result.error) {
      if (result.error.status === 403) {
        handleApiError({ ...result.error, status: 403 });
      } else if (result.error.status === 500 || result.error.status === 'FETCH_ERROR') {
        handleApiError(result.error);
      } else if (result.error.status !== 401) {
        handleApiError(result.error);
      }
    }

    return result;
  };

  return baseQueryWithReauth;
};

import { toast } from 'sonner';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001';
export const API_BASE_URL = `${BACKEND_URL}/api/v1`;

let isRefreshing = false;
let refreshQueue: Array<(token: string | null) => void> = [];

function notifyQueue(token: string | null) {
  refreshQueue.forEach((cb) => cb(token));
  refreshQueue = [];
}

function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('accessToken');
}

function setStoredToken(token: string) {
  if (typeof window !== 'undefined') localStorage.setItem('accessToken', token);
}

function clearAuthAndRedirect() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    window.location.href = '/auth/login';
  }
}

async function refreshAccessToken(): Promise<string | null> {
  try {
    const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;
    const res = await fetch(`${BACKEND_URL}/api/v1/auth/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
      credentials: 'include',
    });
    if (!res.ok) return null;
    const data = await res.json();
    const newToken = data?.data?.accessToken;
    if (newToken) setStoredToken(newToken);
    return newToken || null;
  } catch {
    return null;
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers, credentials: 'include' });
  } catch {
    toast.error('Unable to connect to server. Please check your network.');
    throw new Error('Network error');
  }

  if (response.status === 401) {
    if (!isRefreshing) {
      isRefreshing = true;
      const newToken = await refreshAccessToken();
      isRefreshing = false;
      notifyQueue(newToken);
      if (!newToken) {
        clearAuthAndRedirect();
        throw new Error('Session expired');
      }
    } else {
      await new Promise<void>((resolve) => { refreshQueue.push(() => resolve()); });
    }
    const retryToken = getStoredToken();
    const retryHeaders = { ...headers, Authorization: `Bearer ${retryToken}` };
    try {
      response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers: retryHeaders, credentials: 'include' });
    } catch {
      toast.error('Unable to connect to server.');
      throw new Error('Network error on retry');
    }
  }

  if (!response.ok) {
    let errBody: any = {};
    try { errBody = await response.json(); } catch { /* ignore */ }
    const message = errBody?.message || errBody?.error?.message || `Request failed (${response.status})`;

    if (response.status === 403) {
      toast.error('You do not have permission to perform this action.');
    } else if (response.status === 404) {
      toast.error('Resource not found.');
    } else if (response.status === 409) {
      toast.error(message);
    } else if (response.status >= 500) {
      toast.error('Server error. Please try again later.');
    } else {
      toast.error(message);
    }
    throw Object.assign(new Error(message), { status: response.status, data: errBody });
  }

  const text = await response.text();
  return text ? (JSON.parse(text) as T) : ({} as T);
}

export const api = {
  get: <T>(endpoint: string, options?: RequestInit) =>
    request<T>(endpoint, { method: 'GET', ...options }),
  post: <T>(endpoint: string, body?: unknown, options?: RequestInit) =>
    request<T>(endpoint, { method: 'POST', body: JSON.stringify(body), ...options }),
  put: <T>(endpoint: string, body?: unknown, options?: RequestInit) =>
    request<T>(endpoint, { method: 'PUT', body: JSON.stringify(body), ...options }),
  patch: <T>(endpoint: string, body?: unknown, options?: RequestInit) =>
    request<T>(endpoint, { method: 'PATCH', body: JSON.stringify(body), ...options }),
  del: <T>(endpoint: string, options?: RequestInit) =>
    request<T>(endpoint, { method: 'DELETE', ...options }),
};

export interface Notification {
  _id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationsResponse {
  success: boolean;
  data: {
    items: Notification[];
    pagination: {
      page: number;
      pageSize: number;
      total: number;
      totalPages: number;
    };
    unreadCount: number;
  };
  message: string;
}

export const notificationsApi = {
  getAll: (params?: { unreadOnly?: boolean; page?: number; pageSize?: number }) =>
    api.get<NotificationsResponse>(`/notifications?${new URLSearchParams(params as any).toString()}`),
  getById: (id: string) => api.get<{ success: boolean; data: Notification; message: string }>(`/notifications/${id}`),
  markAsRead: (id: string) => api.put<{ success: boolean; data: Notification; message: string }>(`/notifications/${id}/mark-read`, {}),
  markAllAsRead: () => api.put<{ success: boolean; message: string }>(`/notifications/mark-all-read`, {}),
  delete: (id: string) => api.del<{ success: boolean; message: string }>(`/notifications/${id}`),
};

export interface CreateUserRequest {
  employeeId?: string;
  email: string;
  password: string;
  role: 'superadmin' | 'hr_manager' | 'accounts' | 'employee' | 'support';
  companyId?: string;
  firstName?: string;
  lastName?: string;
  department?: string;
}

export interface CreateUserResponse {
  success: boolean;
  data: {
    id: string;
    employeeId: string;
    email: string;
    role: string;
    isActive: boolean;
  };
  message: string;
}

export const usersApi = {
  create: (userData: CreateUserRequest) =>
    api.post<CreateUserResponse>('/users/dashboard/create', userData),
};

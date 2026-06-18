export const APP_NAME = 'HRMS - Coral Group';

export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  EMPLOYEE: 'employee',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const STORAGE_KEYS = {
  ROLE: 'hrms.sidebar.role',
  COLLAPSED: 'hrms.sidebar.collapsed',
  EXPANDED: 'hrms.sidebar.expanded',
  TOKEN: 'accessToken',
  USER: 'user',
} as const;

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

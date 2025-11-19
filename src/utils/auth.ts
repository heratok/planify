export type UserRole = 'admin' | 'collaborator' | 'viewer';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  hasPermission: (requiredRole: string) => boolean;
  updateRole: (role: UserRole) => Promise<void>;
}
// Mock users for demonstration
export const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'admin@planify.com',
    name: 'Admin User',
    role: 'admin',
    avatar: '👑',
  },
  {
    id: '2',
    email: 'collaborator@planify.com',
    name: 'Collaborator User',
    role: 'collaborator',
    avatar: '👥',
  },
  {
    id: '3',
    email: 'viewer@planify.com',
    name: 'Viewer User',
    role: 'viewer',
    avatar: '👁️',
  },
];

// Role permissions mapping
export const ROLE_PERMISSIONS = {
  admin: {
    canCreateProjects: true,
    canEditProjects: true,
    canDeleteProjects: true,
    canCreateTasks: true,
    canEditTasks: true,
    canDeleteTasks: true,
    canViewAll: true,
  },
  collaborator: {
    canCreateProjects: true,
    canEditProjects: true,
    canDeleteProjects: false,
    canCreateTasks: true,
    canEditTasks: true,
    canDeleteTasks: true,
    canViewAll: true,
  },
  viewer: {
    canCreateProjects: false,
    canEditProjects: false,
    canDeleteProjects: false,
    canCreateTasks: false,
    canEditTasks: false,
    canDeleteTasks: false,
    canViewAll: true,
  },
} as const;

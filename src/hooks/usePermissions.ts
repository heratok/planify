import { useAuth } from '../context/useAuth';
import { ROLE_PERMISSIONS } from '../utils/auth';

export const usePermissions = () => {
  const { user } = useAuth();

  const canCreateProjects = user
    ? ROLE_PERMISSIONS[user.role].canCreateProjects
    : false;

  const canEditProjects = user
    ? ROLE_PERMISSIONS[user.role].canEditProjects
    : false;

  const canDeleteProjects = user
    ? ROLE_PERMISSIONS[user.role].canDeleteProjects
    : false;

  const canCreateTasks = user
    ? ROLE_PERMISSIONS[user.role].canCreateTasks
    : false;

  const canEditTasks = user ? ROLE_PERMISSIONS[user.role].canEditTasks : false;

  const canDeleteTasks = user
    ? ROLE_PERMISSIONS[user.role].canDeleteTasks
    : false;

  const canViewAll = user ? ROLE_PERMISSIONS[user.role].canViewAll : false;

  return {
    canCreateProjects,
    canEditProjects,
    canDeleteProjects,
    canCreateTasks,
    canEditTasks,
    canDeleteTasks,
    canViewAll,
  };
};

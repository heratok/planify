import { useState } from 'react';
import type { Project, Task } from '../utils/types';
import { useNotifications } from './useNotifications';
import { usePermissions } from './usePermissions';
import { api } from '../utils/api';

interface UseProjectsProps {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

export const useProjects = ({
  projects,
  setProjects,
  setTasks,
}: UseProjectsProps) => {
  const { addNotification } = useNotifications();
  const { canCreateProjects, canEditProjects, canDeleteProjects } =
    usePermissions();

  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const handleCreate = () => {
    if (!canCreateProjects) {
      addNotification('error', 'You do not have permission to create projects');
      return;
    }
    setEditingProject(undefined);
    setShowForm(true);
  };

  const handleEdit = (project: Project) => {
    if (!canEditProjects) {
      addNotification('error', 'You do not have permission to edit projects');
      return;
    }
    setEditingProject(project);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!canDeleteProjects) {
      addNotification('error', 'You do not have permission to delete projects');
      return;
    }

    try {
      await api.projects.delete(id);

      const projectToDelete = projects.find((p) => p.id === id);
      setProjects(projects.filter((p) => p.id !== id));
      setTasks((tasks: Task[]) => tasks.filter((t) => t.projectId !== id));

      if (selectedProject?.id === id) {
        setSelectedProject(null);
      }

      if (projectToDelete) {
        addNotification('info', `Proyecto "${projectToDelete.name}" eliminado`);
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      addNotification('error', 'Failed to delete project');
    }
  };

  const handleSave = async (projectData: Omit<Project, 'id' | 'createdAt'>) => {
    try {
      if (editingProject) {
        // Update existing project
        const updatedProject = await api.projects.update(
          editingProject.id,
          projectData
        );

        setProjects(
          projects.map((p) => (p.id === editingProject.id ? updatedProject : p))
        );
        addNotification(
          'success',
          `Proyecto "${projectData.name}" actualizado exitosamente`
        );
      } else {
        // Create new project
        const newProject = await api.projects.create(projectData);

        setProjects([newProject, ...projects]);
        addNotification(
          'success',
          `Proyecto "${projectData.name}" creado exitosamente`
        );
      }
      setShowForm(false);
    } catch (error) {
      console.error('Error saving project:', error);
      addNotification('error', 'Failed to save project');
      throw error; // Re-throw to let the form handle the error state
    }
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  const handleViewKanban = async (project: Project) => {
    setSelectedProject(project);
    // Fetch tasks for this project when viewing kanban
    try {
      const tasks = await api.tasks.list(project.id);
      setTasks(tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      addNotification('error', 'Failed to load tasks');
    }
  };

  const handleBackToProjects = () => {
    setSelectedProject(null);
  };

  return {
    // State
    showForm,
    editingProject,
    selectedProject,

    // Actions
    handleCreate,
    handleEdit,
    handleDelete,
    handleSave,
    handleCancel,
    handleViewKanban,
    handleBackToProjects,

    // Permissions
    canCreateProjects,
    canEditProjects,
    canDeleteProjects,
  };
};

import { useState } from 'react';
import type { Task, TaskStatus } from '../utils/types';
import { useNotifications } from './useNotifications';
import { usePermissions } from './usePermissions';
import { api } from '../utils/api';

interface UseTasksProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

export const useTasks = ({ tasks, setTasks }: UseTasksProps) => {
  const { addNotification } = useNotifications();
  const { canCreateTasks, canEditTasks, canDeleteTasks } = usePermissions();

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');

  const createTask = async (
    projectId: string,
    title: string,
    description: string,
    priority: Task['priority'] = 'Medium',
    dueDate: Date = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    assignedUser: string = 'Unassigned',
    status: TaskStatus = 'To Do'
  ) => {
    if (!canCreateTasks) {
      addNotification('error', 'You do not have permission to create tasks');
      return;
    }

    try {
      const newTask = await api.tasks.create({
        title,
        description,
        priority,
        dueDate,
        assignedUser,
        status,
        projectId,
      });

      setTasks((prevTasks) => [...prevTasks, newTask]);
      addNotification('success', 'Task created successfully');
    } catch (error) {
      console.error('Error creating task:', error);
      addNotification('error', 'Failed to create task');
    }
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    if (!canEditTasks) {
      addNotification('error', 'You do not have permission to edit tasks');
      return;
    }

    try {
      const updatedTask = await api.tasks.update(taskId, updates);
      
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, ...updatedTask } : task
        )
      );
      addNotification('success', 'Task updated successfully');
    } catch (error) {
      console.error('Error updating task:', error);
      addNotification('error', 'Failed to update task');
    }
  };

  const deleteTask = async (taskId: string) => {
    if (!canDeleteTasks) {
      addNotification('error', 'You do not have permission to delete tasks');
      return;
    }

    try {
      await api.tasks.delete(taskId);
      
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      addNotification('success', 'Task deleted successfully');
    } catch (error) {
      console.error('Error deleting task:', error);
      addNotification('error', 'Failed to delete task');
    }
  };

  const moveTask = (taskId: string, newStatus: TaskStatus) => {
    updateTask(taskId, { status: newStatus });
  };

  const startEditingTask = (task: Task) => {
    setEditingTask(task);
    setNewTaskTitle(task.title);
    setNewTaskDescription(task.description);
  };

  const saveEditedTask = () => {
    if (!editingTask) return;

    updateTask(editingTask.id, {
      title: newTaskTitle,
      description: newTaskDescription,
    });
    setEditingTask(null);
    setNewTaskTitle('');
    setNewTaskDescription('');
  };

  const cancelEditingTask = () => {
    setEditingTask(null);
    setNewTaskTitle('');
    setNewTaskDescription('');
  };

  const addNewTask = () => {
    if (!selectedProjectId || !newTaskTitle.trim()) {
      addNotification(
        'error',
        'Please select a project and enter a task title'
      );
      return;
    }

    createTask(
      selectedProjectId,
      newTaskTitle.trim(),
      newTaskDescription.trim()
    );
    setNewTaskTitle('');
    setNewTaskDescription('');
    setSelectedProjectId('');
  };

  const getTasksByProject = (projectId: string) => {
    return tasks.filter((task) => task.projectId === projectId);
  };

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter((task) => task.status === status);
  };

  return {
    // State
    editingTask,
    newTaskTitle,
    newTaskDescription,
    selectedProjectId,

    // State setters
    setNewTaskTitle,
    setNewTaskDescription,
    setSelectedProjectId,

    // Actions
    createTask,
    updateTask,
    deleteTask,
    moveTask,
    startEditingTask,
    saveEditedTask,
    cancelEditingTask,
    addNewTask,

    // Getters
    getTasksByProject,
    getTasksByStatus,

    // Permissions
    canCreateTasks,
    canEditTasks,
    canDeleteTasks,
  };
};

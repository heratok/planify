import React, { useState } from 'react';
import type { Project, Task, TaskStatus } from '../utils/types';
import ProjectForm from '../components/ProjectForm';
import TaskDetailModal from '../components/TaskDetailModal';
import ProjectsList from '../components/ProjectsList';
import ProjectKanbanView from '../components/ProjectKanbanView';
import type { DropResult } from '@hello-pangea/dnd';
import { useNotifications } from '../hooks/useNotifications';
import { useProjects } from '../hooks/useProjects';
import { useTasks } from '../hooks/useTasks';
import { usePermissions } from '../hooks/usePermissions';

interface ProjectsProps {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const Projects: React.FC<ProjectsProps> = ({
  projects,
  setProjects,
  tasks,
  setTasks,
}) => {
  const { addNotification } = useNotifications();
  const {
    canCreateProjects,
    canEditProjects,
    canDeleteProjects,
    canCreateTasks,
    canEditTasks,
    canDeleteTasks,
  } = usePermissions();
  const projectsHook = useProjects({ projects, setProjects, setTasks });
  const tasksHook = useTasks({ tasks, setTasks });

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>();
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showTaskDetailModal, setShowTaskDetailModal] = useState(false);

  const handleCreate = () => {
    projectsHook.handleCreate();
    setEditingProject(undefined);
    setShowForm(true);
  };

  const handleEdit = (project: Project) => {
    projectsHook.handleEdit(project);
    setEditingProject(project);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    projectsHook.handleDelete(id);
  };

  const handleSave = async (projectData: Omit<Project, 'id' | 'createdAt'>) => {
    await projectsHook.handleSave(projectData);
    setShowForm(false);
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  const handleViewKanban = (project: Project) => {
    setSelectedProject(project);
  };

  const handleBackToProjects = () => {
    setSelectedProject(null);
  };

  const handleCreateTask = () => {
    if (!canCreateTasks) {
      return;
    }
    setEditingTask(undefined);
    setShowTaskForm(true);
  };

  const handleEditTask = (task: Task) => {
    if (!canEditTasks) {
      return;
    }
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleDeleteTask = (id: string) => {
    if (!canDeleteTasks) {
      return;
    }
    const task = tasks.find((t) => t.id === id);
    if (task) {
      setTaskToDelete(task);
    }
  };

  const confirmDeleteTask = () => {
    if (taskToDelete) {
      tasksHook.deleteTask(taskToDelete.id);
      setTaskToDelete(null);
    }
  };

  const cancelDeleteTask = () => {
    setTaskToDelete(null);
  };

  const handleSaveTask = (taskData: Omit<Task, 'id' | 'projectId'>) => {
    if (editingTask) {
      tasksHook.updateTask(editingTask.id, taskData);
    } else {
      // Pass the complete task data to createTask
      tasksHook.createTask(
        selectedProject!.id,
        taskData.title,
        taskData.description,
        taskData.priority,
        taskData.dueDate,
        taskData.assignedUser,
        taskData.status
      );
    }
    setShowTaskForm(false);
  };

  const handleCancelTask = () => {
    setShowTaskForm(false);
  };

  const handleViewTaskDetails = (task: Task) => {
    setSelectedTask(task);
    setShowTaskDetailModal(true);
  };

  const handleCloseTaskDetailModal = () => {
    setShowTaskDetailModal(false);
    setSelectedTask(null);
  };

  const handleAddComment = (taskId: string, commentText: string) => {
    const mockUsers = [
      'Alice Johnson',
      'Bob Wilson',
      'Carol Davis',
      'David Brown',
      'Emma Garcia',
      'Frank Miller',
      'Grace Lee',
      'Henry Taylor',
    ];

    const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];

    const newComment = {
      id: Date.now().toString(),
      text: commentText,
      author: randomUser,
      createdAt: new Date(),
    };

    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? { ...task, comments: [...task.comments, newComment] }
          : task
      )
    );

    addNotification('success', `Comentario agregado exitosamente`);
  };

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // If there's no destination or the item was dropped in the same place
    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    ) {
      return;
    }

    // Find the task being dragged
    const task = tasks.find((t) => t.id === draggableId);
    if (!task) return;

    // Update the task status based on the destination column
    const newStatus = destination.droppableId as TaskStatus;

    // Optimistically update UI
    setTasks(
      tasks.map((t) => (t.id === draggableId ? { ...t, status: newStatus } : t))
    );

    // Persist to Supabase
    try {
      await tasksHook.updateTask(draggableId, { status: newStatus });
    } catch {
      // Revert on error
      setTasks(
        tasks.map((t) =>
          t.id === draggableId ? { ...t, status: task.status } : t
        )
      );
    }
  };

  if (selectedProject) {
    return (
      <ProjectKanbanView
        project={selectedProject}
        tasks={tasks}
        onBackToProjects={handleBackToProjects}
        onCreateTask={handleCreateTask}
        onEditTask={handleEditTask}
        onDeleteTask={handleDeleteTask}
        onDragEnd={handleDragEnd}
        onViewTaskDetails={handleViewTaskDetails}
        onSaveTask={handleSaveTask}
        onCancelTask={handleCancelTask}
        showTaskForm={showTaskForm}
        editingTask={editingTask}
        taskToDelete={taskToDelete}
        onConfirmDeleteTask={confirmDeleteTask}
        onCancelDeleteTask={cancelDeleteTask}
        canCreateTasks={canCreateTasks}
        canEditTasks={canEditTasks}
        canDeleteTasks={canDeleteTasks}
      />
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Projects
        </h1>
        {canCreateProjects && (
          <button
            onClick={handleCreate}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors"
          >
            + New Project
          </button>
        )}
      </div>

      <ProjectsList
        projects={projects}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onViewKanban={handleViewKanban}
        canEdit={canEditProjects}
        canDelete={canDeleteProjects}
      />

      {showForm && (
        <ProjectForm
          project={editingProject}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}

      {selectedTask && showTaskDetailModal && (
        <TaskDetailModal
          task={selectedTask}
          isOpen={showTaskDetailModal}
          onClose={handleCloseTaskDetailModal}
          onAddComment={handleAddComment}
        />
      )}
    </div>
  );
};

export default Projects;

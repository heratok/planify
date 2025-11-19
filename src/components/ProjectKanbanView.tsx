import React from 'react';
import type { Project, Task } from '../utils/types';
import KanbanBoard from './KanbanBoard';
import TaskForm from './TaskForm';
import type { DropResult } from '@hello-pangea/dnd';

interface ProjectKanbanViewProps {
  project: Project;
  tasks: Task[];
  onBackToProjects: () => void;
  onCreateTask: () => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onDragEnd: (result: DropResult) => void;
  onViewTaskDetails: (task: Task) => void;
  onSaveTask: (taskData: Omit<Task, 'id' | 'projectId'>) => void;
  onCancelTask: () => void;
  showTaskForm: boolean;
  editingTask: Task | undefined;
  taskToDelete: Task | null;
  onConfirmDeleteTask: () => void;
  onCancelDeleteTask: () => void;
  canCreateTasks: boolean;
  canEditTasks: boolean;
  canDeleteTasks: boolean;
}

const ProjectKanbanView: React.FC<ProjectKanbanViewProps> = ({
  project,
  tasks,
  onBackToProjects,
  onCreateTask,
  onEditTask,
  onDeleteTask,
  onDragEnd,
  onViewTaskDetails,
  onSaveTask,
  onCancelTask,
  showTaskForm,
  editingTask,
  taskToDelete,
  onConfirmDeleteTask,
  onCancelDeleteTask,
  canCreateTasks,
  canEditTasks,
  canDeleteTasks,
}) => {
  const projectTasks = tasks.filter((task) => task.projectId === project.id);

  return (
    <div className="h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            onClick={onBackToProjects}
            className="mr-4 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            ←
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {project.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              {project.description}
            </p>
          </div>
        </div>
        {canCreateTasks && (
          <button
            onClick={onCreateTask}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors"
          >
            + New Task
          </button>
        )}
      </div>

      <KanbanBoard
        tasks={projectTasks}
        onEditTask={onEditTask}
        onDeleteTask={onDeleteTask}
        onDragEnd={onDragEnd}
        onViewTaskDetails={onViewTaskDetails}
        canEditTasks={canEditTasks}
        canDeleteTasks={canDeleteTasks}
      />

      {showTaskForm && (
        <TaskForm
          task={editingTask}
          onSave={onSaveTask}
          onCancel={onCancelTask}
        />
      )}

      {taskToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Confirm Delete
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Are you sure you want to delete "{taskToDelete.title}"? This
              action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={onCancelDeleteTask}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onConfirmDeleteTask}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectKanbanView;

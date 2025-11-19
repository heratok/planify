import React, { useState } from 'react';
import type { Task } from '../utils/types';
import CommentList from './CommentList';
import CommentForm from './CommentForm';

interface TaskDetailModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onAddComment: (taskId: string, commentText: string) => void;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  task,
  isOpen,
  onClose,
  onAddComment,
}) => {
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-500';
      case 'Medium':
        return 'bg-yellow-500';
      case 'Low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'To Do':
        return 'bg-gray-500';
      case 'In Progress':
        return 'bg-blue-500';
      case 'Done':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleAddComment = async (commentText: string) => {
    setIsSubmittingComment(true);
    try {
      await onAddComment(task.id, commentText);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Detalles de la Tarea
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Task Info */}
          <div className="mb-6">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {task.title}
              </h3>
              <div className="flex items-center space-x-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(task.status)}`}
                >
                  {task.status}
                </span>
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {task.description}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Prioridad:
                </span>
                <span
                  className={`ml-2 px-2 py-1 rounded-full text-xs font-medium text-white ${getPriorityColor(task.priority)}`}
                >
                  {task.priority}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Fecha límite:
                </span>
                <span className="ml-2 text-sm text-gray-900 dark:text-white">
                  {task.dueDate.toLocaleDateString('es-ES')}
                </span>
              </div>
            </div>

            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">
                {task.assignedUser.charAt(0).toUpperCase()}
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Asignado a:
                </span>
                <span className="ml-2 text-sm text-gray-900 dark:text-white">
                  {task.assignedUser}
                </span>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                Comentarios ({task.comments.length})
              </h4>
            </div>

            {/* Comments List */}
            <div className="mb-6">
              <CommentList comments={task.comments} />
            </div>

            {/* Add Comment Form */}
            <CommentForm
              onAddComment={handleAddComment}
              isSubmitting={isSubmittingComment}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;

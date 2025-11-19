import React from 'react';
import type { Task } from '../utils/types';
import { Draggable } from '@hello-pangea/dnd';
import { Calendar, Eye, Edit2, Trash2 } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  index: number;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onViewDetails: (task: Task) => void;
  canEdit?: boolean;
  canDelete?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  index,
  onEdit,
  onDelete,
  onViewDetails,
  canEdit = true,
  canDelete = true,
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Low':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`group bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-3 hover:shadow-md transition-all duration-200 ${
            snapshot.isDragging
              ? 'rotate-2 shadow-xl scale-105 z-50 ring-2 ring-primary-500 ring-opacity-50'
              : 'hover:border-primary-300 dark:hover:border-primary-600'
          }`}
        >
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1">
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${getPriorityColor(task.priority)}`}
              >
                {task.priority}
              </span>
            </div>

            <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetails(task);
                }}
                className="p-1 text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
              </button>
              {canEdit && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(task);
                  }}
                  className="p-1 text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              )}
              {canDelete && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(task.id);
                  }}
                  className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1 leading-tight">
            {task.title}
          </h4>

          <p className="text-gray-500 dark:text-gray-400 text-xs mb-3 line-clamp-2">
            {task.description}
          </p>

          <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-xs font-medium text-primary-700 dark:text-primary-400">
                {task.assignedUser.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[80px]">
                {task.assignedUser}
              </span>
            </div>

            <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
              <Calendar className="w-3 h-3" />
              {task.dueDate.toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
              })}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;

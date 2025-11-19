import React from 'react';
import type { Task, TaskStatus } from '../utils/types';
import TaskCard from './TaskCard';
import { Droppable } from '@hello-pangea/dnd';

interface TaskColumnProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onViewTaskDetails: (task: Task) => void;
  canEditTasks?: boolean;
  canDeleteTasks?: boolean;
}

const TaskColumn: React.FC<TaskColumnProps> = ({
  title,
  status,
  tasks,
  onEditTask,
  onDeleteTask,
  onViewTaskDetails,
  canEditTasks = true,
  canDeleteTasks = true,
}) => {
  const getColumnColor = (status: TaskStatus) => {
    switch (status) {
      case 'To Do':
        return 'border-gray-300 dark:border-gray-600';
      case 'In Progress':
        return 'border-blue-300 dark:border-blue-600';
      case 'Done':
        return 'border-green-300 dark:border-green-600';
      default:
        return 'border-gray-300 dark:border-gray-600';
    }
  };

  return (
    <div
      className={`flex-1 min-w-0 bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border-2 ${getColumnColor(status)} h-full`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          <div
            className="w-2 h-2 bg-current opacity-40 rounded-full"
            title="Zona de drop"
          ></div>
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 px-2 py-1 rounded-full">
          {tasks.length}
        </span>
      </div>

      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`space-y-3 overflow-y-auto max-h-96 min-h-[200px] p-2 rounded-md transition-all duration-200 ${
              snapshot.isDraggingOver
                ? 'bg-blue-100 dark:bg-blue-900/30 border-2 border-dashed border-blue-400 dark:border-blue-500 shadow-inner'
                : 'border border-transparent'
            }`}
          >
            {tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
                onViewDetails={onViewTaskDetails}
                canEdit={canEditTasks}
                canDelete={canDeleteTasks}
              />
            ))}
            {provided.placeholder}

            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <div className="text-center py-8 text-gray-400 dark:text-gray-500">
                <div className="text-2xl mb-2">📋</div>
                <p className="text-sm">Arrastra tareas aquí</p>
                <p className="text-xs mt-1 opacity-75">
                  para cambiar su estado a "{title}"
                </p>
              </div>
            )}

            {tasks.length === 0 && snapshot.isDraggingOver && (
              <div className="text-center py-8 text-blue-600 dark:text-blue-400">
                <div className="text-3xl mb-2">🎯</div>
                <p className="text-sm font-medium">¡Suelta aquí!</p>
                <p className="text-xs mt-1">Estado: {title}</p>
              </div>
            )}
          </div>
        )}
      </Droppable>

      {tasks.length === 0 && (
        <div className="text-center text-gray-400 dark:text-gray-500 mt-8">
          No tasks
        </div>
      )}
    </div>
  );
};

export default TaskColumn;

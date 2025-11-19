import React from 'react';
import type { Task } from '../utils/types';
import TaskColumn from './TaskColumn';
import { DragDropContext } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';

interface KanbanBoardProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onDragEnd: (result: DropResult) => void;
  onViewTaskDetails: (task: Task) => void;
  canEditTasks?: boolean;
  canDeleteTasks?: boolean;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  onEditTask,
  onDeleteTask,
  onDragEnd,
  onViewTaskDetails,
  canEditTasks = true,
  canDeleteTasks = true,
}) => {
  const columns = [
    { title: 'To Do', status: 'To Do' as const },
    { title: 'In Progress', status: 'In Progress' as const },
    { title: 'Done', status: 'Done' as const },
  ];

  const getTasksByStatus = (status: string) => {
    return tasks.filter((task) => task.status === status);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="h-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-full">
          {columns.map((column) => (
            <TaskColumn
              key={column.status}
              title={column.title}
              status={column.status}
              tasks={getTasksByStatus(column.status)}
              onEditTask={onEditTask}
              onDeleteTask={onDeleteTask}
              onViewTaskDetails={onViewTaskDetails}
              canEditTasks={canEditTasks}
              canDeleteTasks={canDeleteTasks}
            />
          ))}
        </div>
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;

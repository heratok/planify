export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
}

export type TaskPriority = 'Low' | 'Medium' | 'High';
export type TaskStatus = 'To Do' | 'In Progress' | 'Done';

export interface Comment {
  id: string;
  text: string;
  author: string;
  createdAt: Date;
}

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  dueDate: Date;
  assignedUser: string;
  status: TaskStatus;
  projectId: string;
  comments: Comment[];
}

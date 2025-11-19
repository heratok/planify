import React from 'react';
import type { Comment } from '../utils/types';

interface CommentListProps {
  comments: Comment[];
}

const CommentList: React.FC<CommentListProps> = ({ comments }) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (comments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400 dark:text-gray-500">
        <div className="text-3xl mb-2">💬</div>
        <p className="text-sm">No hay comentarios aún</p>
        <p className="text-xs mt-1">Sé el primero en comentar</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-h-60 overflow-y-auto">
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="flex space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
        >
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
              {getInitials(comment.author)}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {comment.author}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {formatDate(comment.createdAt)}
              </span>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {comment.text}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentList;

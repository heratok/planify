import React, { useState } from 'react';

interface CommentFormProps {
  onAddComment: (text: string) => void;
  isSubmitting?: boolean;
}

const CommentForm: React.FC<CommentFormProps> = ({
  onAddComment,
  isSubmitting = false,
}) => {
  const [commentText, setCommentText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim() && !isSubmitting) {
      onAddComment(commentText.trim());
      setCommentText('');
    }
  };

  const mockUsers = [
    'Alice Johnson',
    'Bob Wilson',
    'Carol Davis',
    'David Brown',
    'Emma Garcia',
  ];

  const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-gray-200 dark:border-gray-700 pt-4"
    >
      <div className="flex space-x-3">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
            {randomUser.charAt(0)}
          </div>
        </div>
        <div className="flex-1">
          <div className="mb-2">
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {randomUser}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
              (Usuario simulado)
            </span>
          </div>
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Escribe un comentario..."
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            rows={3}
            disabled={isSubmitting}
          />
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              disabled={!commentText.trim() || isSubmitting}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium"
            >
              {isSubmitting ? 'Enviando...' : 'Comentar'}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CommentForm;

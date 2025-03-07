import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import Button from '../common/Button';

import { Comment } from '../types/types';
import { deleteComment } from '../../services/memoryService';

interface CommentEntryProps {
  comment: Comment;
  index: number;
}

const MemoryDetailsPopupCommentsEntry: React.FC<CommentEntryProps> = ({ comment, index }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [deleteSuccessMessage, setDeleteSuccessMessage] = useState('');
  const [deleteErrorMessage, setDeleteErrorMessage] = useState('');

  const handleDeleteComment = async () => {
    try {
      await deleteComment(comment.id);
      setDeleteSuccessMessage('Comment deleted successfully!');
      setDeleteErrorMessage('');
    } catch (error) {
      setDeleteSuccessMessage('');
      setDeleteErrorMessage('Failed to delete comment. Please try again.');
    }
    setShowConfirmation(false);
  };

  return (
    <div key={index} className="flex flex-col gap-4 items-start space-x-3 bg-gray-100 p-3 rounded-md shadow-sm border border-gray-300">
      <div className="flex flex-row space-x-2 items-center w-full">
        <div className="flex flex-row justify-between px-2 pb-2 w-full">
          <div className="flex flex-row items-center gap-3">
            <img
              src={comment.avatar_url}
              alt="Profile"
              className="w-10 h-10 rounded-full"
            />
            <p><strong>{comment.first_name} {comment.last_name} {comment.id}</strong></p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-sm text-gray-500">Commented on: {new Date(comment.created_at).toLocaleString('en-US', { month: 'short', day: '2-digit', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true })}</p>
            <div className="flex justify-end w-full">
              <FontAwesomeIcon icon={faTrash} className="text-red-500 cursor-pointer" onClick={() => setShowConfirmation(true)} />
            </div>
          </div>
        </div>
      </div>
      <p>{deleteSuccessMessage ? "[This comment is deleted]" : comment.text}</p>

      {/* Comment deletion confirmation */}
      {showConfirmation && <>
        <hr className="border-t border-gray-300 w-full" />
        <div className="w-full mt-2 flex flex-col items-center">
          <p>Are you sure you want to delete this comment?</p>
          <div className="flex justify-end space-x-4 mt-2">
            <Button type="button" text="Yes" className="bg-red-500 text-white px-3 py-1 rounded-md" onClick={handleDeleteComment} />
            <Button type="button" text="No" className="bg-gray-300 text-black px-3 py-1 rounded-md" onClick={() => setShowConfirmation(false)} />
          </div>
          {deleteErrorMessage && <p className="text-red-500 mt-2">{deleteErrorMessage}</p>}
        </div>
      </>}

      {/* Comment deletion success text */}
      {deleteSuccessMessage && <>
        <hr className="border-t border-gray-300 w-full" />
        <p>{deleteSuccessMessage}</p>
      </>}
    </div>
  );
};

export default MemoryDetailsPopupCommentsEntry;
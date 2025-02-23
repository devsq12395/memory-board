import React, { useEffect, useState } from 'react';
import { getCommentsByMemoryId, addComment } from '../../services/memoryService';
import Button from '../common/Button';

import { getUserDetailsViaID } from '../../services/profile';
import { useUser } from '../contexts/UserContext';

interface MemoryDetailsPopupCommentsProps {
  memoryId: string;
}

const MemoryDetailsPopupComments: React.FC<MemoryDetailsPopupCommentsProps> = ({ memoryId }) => {
  const [comments, setComments] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [submitCommentStatus, setSubmitCommentStatus] = useState('');
  const commentsPerPage = 5;

  const UserContext = useUser();

  useEffect(() => {
    fetchComments();
  }, [memoryId]);

  const fetchComments = async () => {
    const commentsData = await getCommentsByMemoryId(memoryId);
    const commentsWithUserDetails = await Promise.all(
      commentsData.map(async (comment) => {
        const userDetails = await getUserDetailsViaID(comment.commenter_user_id);
        return {
          ...comment,
          ...userDetails
        };
      })
    );
    setComments(commentsWithUserDetails);
  };

  const totalPages = Math.ceil(comments.length / commentsPerPage);

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => (prevPage > 0 ? prevPage - 1 : totalPages - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => (prevPage < totalPages - 1 ? prevPage + 1 : 0));
  };

  const currentComments = comments.slice(
    currentPage * commentsPerPage,
    (currentPage + 1) * commentsPerPage
  );

  const handleSubmitComment = async () => {
    try {
      const userId = UserContext.uid;
      if (!userId) {
        setSubmitCommentStatus('Comment submission failed');
        return;
      }

      await addComment(memoryId, userId, newComment);
      setNewComment('');

      fetchComments();
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      {/* Comment Input and Submit Button */}
      <div className="flex flex-col space-y-2 w-full">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="bg-gray-100 border border-gray-300 focus:outline-none focus:border-blue-500 resize-none h-12 p-2 rounded-md w-full text-sm"
        />

        {/* Display Submit Comment Status */}
        {submitCommentStatus && (
          <p className="text-sm text-red-500">{submitCommentStatus}</p>
        )}
        <div className="flex justify-end">
          <Button type="button" text="Submit Comment" styleType="primary" onClick={handleSubmitComment} />
        </div>
      </div>

      {/* Comments List */}
      <div className="w-full">
        {comments.map((comment, index) => (
          <div key={index} className="flex flex-col gap-4 items-start space-x-3 bg-gray-100 p-3 rounded-md shadow-sm border border-gray-300">
            <div className="flex flex-row space-x-2 items-center w-full">
              <div className="flex flex-row justify-between px-2 pb-2 w-full">
                <div className="flex flex-row items-center gap-3">
                  <img
                    src={comment.avatar_url}
                    alt="Profile"
                    className="w-10 h-10 rounded-full"
                  />
                  <p><strong>{comment.first_name} {comment.last_name}</strong></p>
                </div>
                <p className="text-sm text-gray-500">Commented on: {new Date(comment.created_at).toLocaleString('en-US', { month: 'short', day: '2-digit', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true })}</p>
              </div>
            </div>
            <p>{comment.text}</p>
          </div>
        ))}
      </div>

      {/* Pagination of Comments */}
      <div className="flex items-center">
        <button className="bg-gray-300 rounded-full p-3 mx-2 text-2xl flex items-center justify-center" onClick={handlePrevPage}>{'<'}</button>
        <div className="flex items-start space-x-2 overflow-x-auto">
          <div className="py-2 border-b border-gray-300">
            <p>Page {currentPage + 1} / {totalPages}</p>
          </div>
        </div>
        <button className="bg-gray-300 rounded-full p-3 mx-2 text-2xl flex items-center justify-center" onClick={handleNextPage}>{'>'}</button>
      </div>
      {/* Page Indicator */}
      <div className="flex space-x-1 mt-2">
        {Array.from({ length: totalPages }).map((_, index) => (
          <span
            key={index}
            className={`h-3 w-3 rounded-full ${index === currentPage ? 'bg-blue-500' : 'bg-gray-300'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default MemoryDetailsPopupComments;
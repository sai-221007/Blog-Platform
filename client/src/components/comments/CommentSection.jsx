import React, { useState, useEffect } from 'react';
import { commentService } from '../../services/commentService';
import { useToast } from '../../context/ToastContext';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';
import { MessageSquare, Loader2 } from 'lucide-react';

export default function CommentSection({ postId, postAuthorId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    let isMounted = true;
    const fetchComments = async () => {
      try {
        const data = await commentService.getComments(postId);
        if (isMounted) setComments(data);
      } catch (err) {
        console.error('Failed to load comments:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (postId) {
      fetchComments();
    }

    return () => {
      isMounted = false;
    };
  }, [postId]);

  const handleCreateComment = async (content) => {
    setSubmitting(true);
    try {
      const newComment = await commentService.createComment(postId, content);
      setComments((prev) => [newComment, ...prev]);
      showToast('Comment published to discussion.', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to post comment.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateComment = async (commentId, content) => {
    try {
      const updated = await commentService.updateComment(commentId, content);
      setComments((prev) =>
        prev.map((c) => (c._id === commentId ? updated : c))
      );
      showToast('Comment updated.', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update comment.', 'error');
      throw err;
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await commentService.deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
      showToast('Comment removed.', 'info');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete comment.', 'error');
    }
  };

  return (
    <section className="space-y-8" id="comments">
      {/* Header with Count */}
      <div className="flex items-center space-x-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="p-2 rounded-xl bg-inkora-teal/10 text-inkora-teal">
          <MessageSquare className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-serif text-2xl font-bold text-slate-900 dark:text-white">
            Responses & Discourse
          </h3>
          <p className="text-xs text-slate-500">
            {comments.length} {comments.length === 1 ? 'thought' : 'thoughts'} shared on this essay
          </p>
        </div>
      </div>

      {/* Comment Form */}
      <CommentForm onSubmit={handleCreateComment} isSubmitting={submitting} />

      {/* Comment List */}
      {loading ? (
        <div className="flex items-center justify-center py-12 text-slate-400 space-x-2">
          <Loader2 className="w-5 h-5 animate-spin text-inkora-teal" />
          <span className="text-xs">Loading responses...</span>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl">
          <p className="text-sm text-slate-500 mb-1">No responses yet.</p>
          <p className="text-xs text-slate-400">Be the first to share an insight or question.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              postAuthorId={postAuthorId}
              onUpdate={handleUpdateComment}
              onDelete={handleDeleteComment}
            />
          ))}
        </div>
      )}
    </section>
  );
}

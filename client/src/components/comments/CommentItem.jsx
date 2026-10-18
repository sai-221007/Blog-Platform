import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Edit2, Trash2, Check, X } from 'lucide-react';

export default function CommentItem({ comment, postAuthorId, onUpdate, onDelete }) {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isCommentOwner = user && user._id === comment.author?._id;
  const isPostOwner = user && user._id === postAuthorId;
  const isAdmin = user && user.role === 'admin';
  const canDelete = isCommentOwner || isPostOwner || isAdmin;

  const formattedDate = new Date(comment.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleSaveEdit = async () => {
    if (!editContent.trim()) return;
    setIsSubmitting(true);
    try {
      await onUpdate(comment._id, editContent.trim());
      setIsEditing(false);
    } catch (err) {
      // Handled in parent
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    setEditContent(comment.content);
    setIsEditing(false);
  };

  return (
    <div className="p-5 rounded-2xl editorial-glass border border-slate-200 dark:border-slate-800/80 transition-all duration-200">
      {/* Author and Date Row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <img
            src={
              comment.author?.avatar ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'
            }
            alt={comment.author?.name || 'Reader'}
            className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-300 dark:ring-slate-700"
          />
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-slate-900 dark:text-white">
                {comment.author?.name || 'Reader'}
              </span>
              {comment.author?._id === postAuthorId && (
                <span className="text-[10px] font-bold uppercase tracking-wider text-inkora-teal px-1.5 py-0.2 rounded bg-inkora-teal/10">
                  Author
                </span>
              )}
            </div>
            <span className="text-[11px] text-slate-400">{formattedDate}</span>
          </div>
        </div>

        {/* Action Controls for Owner / Moderation */}
        <div className="flex items-center space-x-2">
          {isCommentOwner && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-inkora-teal hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
              title="Edit Comment"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          )}
          {canDelete && !isEditing && (
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this comment?')) {
                  onDelete(comment._id);
                }
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              title="Delete Comment"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Comment Body / Edit Form */}
      {isEditing ? (
        <div className="mt-2 space-y-3">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            rows={3}
            className="w-full p-3 text-xs rounded-xl bg-slate-100 dark:bg-inkora-surface border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-200 focus:outline-none focus:border-inkora-teal font-sans"
            placeholder="Edit your comment..."
          />
          <div className="flex items-center justify-end space-x-2">
            <button
              onClick={handleCancelEdit}
              disabled={isSubmitting}
              className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center space-x-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>Cancel</span>
            </button>
            <button
              onClick={handleSaveEdit}
              disabled={isSubmitting || !editContent.trim()}
              className="px-3 py-1.5 text-xs rounded-lg bg-inkora-teal text-inkora-navy font-semibold hover:bg-inkora-teal/90 transition-colors flex items-center space-x-1"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Saving...' : 'Save'}</span>
            </button>
          </div>
        </div>
      ) : (
        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans whitespace-pre-wrap pl-11">
          {comment.content}
        </p>
      )}
    </div>
  );
}

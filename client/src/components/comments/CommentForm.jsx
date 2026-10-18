import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Send, Lock } from 'lucide-react';

export default function CommentForm({ onSubmit, isSubmitting = false }) {
  const { user, isAuthenticated } = useAuth();
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || isSubmitting) return;

    await onSubmit(content.trim());
    setContent('');
  };

  if (!isAuthenticated) {
    return (
      <div className="p-6 rounded-2xl editorial-glass border border-slate-200 dark:border-slate-800 text-center space-y-3">
        <Lock className="w-5 h-5 text-slate-400 mx-auto" />
        <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
          Join the Editorial Discourse
        </h4>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Sign in to contribute your thoughts, citations, or questions to this essay.
        </p>
        <div className="pt-2">
          <Link
            to="/login"
            className="inline-flex items-center space-x-2 text-xs font-semibold px-4 py-2 rounded-full bg-inkora-teal text-inkora-navy hover:bg-inkora-teal/90 transition-colors shadow-md"
          >
            <span>Sign In to Comment</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-5 rounded-2xl editorial-glass border border-slate-200 dark:border-slate-800 space-y-3"
    >
      <div className="flex items-center space-x-3 mb-1">
        <img
          src={
            user?.avatar ||
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'
          }
          alt={user?.name}
          className="w-7 h-7 rounded-full object-cover ring-1 ring-inkora-teal/40"
        />
        <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
          Responding as <strong className="text-slate-900 dark:text-white">{user?.name}</strong>
        </span>
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
        maxLength={1500}
        placeholder="Share a thoughtful perspective, critique, or inquiry..."
        className="w-full p-4 text-xs sm:text-sm rounded-xl bg-slate-100 dark:bg-inkora-surface border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-200 focus:outline-none focus:border-inkora-teal font-sans resize-none"
      />

      <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
        <span>{1500 - content.length} characters remaining</span>
        <button
          type="submit"
          disabled={!content.trim() || isSubmitting}
          className="inline-flex items-center space-x-2 px-5 py-2 rounded-full bg-inkora-teal text-inkora-navy font-semibold text-xs hover:bg-inkora-teal/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-md shadow-inkora-teal/20"
        >
          <Send className="w-3.5 h-3.5" />
          <span>{isSubmitting ? 'Publishing...' : 'Publish Comment'}</span>
        </button>
      </div>
    </form>
  );
}

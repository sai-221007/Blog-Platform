import React from 'react';
import { Link } from 'react-router-dom';

export default function AuthorCard({ author, className = '' }) {
  if (!author) return null;

  return (
    <div
      className={`rounded-2xl p-6 editorial-glass border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-5 ${className}`}
    >
      <Link to={`/profile/${author._id}`} className="shrink-0">
        <img
          src={
            author.avatar ||
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'
          }
          alt={author.name}
          className="w-16 h-16 rounded-full object-cover ring-2 ring-inkora-teal/30 hover:ring-inkora-teal transition-all duration-300"
        />
      </Link>

      <div className="flex-1 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1">
          <Link
            to={`/profile/${author._id}`}
            className="font-serif text-lg font-bold text-slate-900 dark:text-white hover:text-inkora-teal transition-colors"
          >
            {author.name}
          </Link>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-inkora-teal px-2 py-0.5 rounded-full bg-inkora-teal/10 w-fit mx-auto sm:mx-0 mt-1 sm:mt-0">
            {author.role || 'Author'}
          </span>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans mt-2">
          {author.bio || 'Contributing essayist and editorial thinker on INKORA.'}
        </p>

        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800/80">
          <Link
            to={`/profile/${author._id}`}
            className="text-xs font-semibold text-inkora-teal hover:underline inline-flex items-center space-x-1"
          >
            <span>View All Stories by {author.name?.split(' ')[0]}</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

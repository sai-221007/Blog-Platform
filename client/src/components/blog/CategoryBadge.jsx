import React from 'react';
import { Link } from 'react-router-dom';

const categoryColorMap = {
  Technology: 'bg-teal-500/10 text-teal-400 border-teal-500/20 hover:border-teal-400',
  Design: 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:border-amber-400',
  Programming: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:border-emerald-400',
  Science: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 hover:border-indigo-400',
  Creativity: 'bg-rose-500/10 text-rose-400 border-rose-500/20 hover:border-rose-400',
  Lifestyle: 'bg-sky-500/10 text-sky-400 border-sky-500/20 hover:border-sky-400',
  Business: 'bg-purple-500/10 text-purple-400 border-purple-500/20 hover:border-purple-400',
};

export default function CategoryBadge({ category, clickable = true, size = 'default' }) {
  const colorClass =
    categoryColorMap[category] || 'bg-slate-500/10 text-slate-400 border-slate-500/20';

  const sizeClass =
    size === 'small'
      ? 'text-[10px] px-2.5 py-0.5 tracking-wider'
      : 'text-xs px-3 py-1 tracking-wide';

  const badge = (
    <span
      className={`inline-flex items-center uppercase font-semibold rounded-full border transition-all duration-200 ${colorClass} ${sizeClass}`}
    >
      {category}
    </span>
  );

  if (clickable) {
    return (
      <Link
        to={`/explore?category=${encodeURIComponent(category)}`}
        className="inline-block hover:scale-105 transition-transform"
        onClick={(e) => e.stopPropagation()}
      >
        {badge}
      </Link>
    );
  }

  return badge;
}

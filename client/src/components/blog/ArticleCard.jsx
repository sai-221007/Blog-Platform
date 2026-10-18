import React from 'react';
import { Link } from 'react-router-dom';
import CategoryBadge from './CategoryBadge';
import { Clock, Eye, Heart, MessageSquare } from 'lucide-react';

export default function ArticleCard({ post }) {
  if (!post) return null;

  const formattedDate = new Date(post.publishedAt || post.createdAt).toLocaleDateString(
    'en-US',
    {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }
  );

  return (
    <article className="group flex flex-col rounded-2xl overflow-hidden editorial-glass editorial-glass-hover h-full">
      {/* Cover Image Container */}
      <Link
        to={`/post/${post.slug || post._id}`}
        className="relative block aspect-[16/10] overflow-hidden bg-slate-900"
      >
        <img
          src={post.coverImage}
          alt={post.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-inkora-navy/80 via-transparent to-transparent opacity-60" />
        <div className="absolute top-4 left-4">
          <CategoryBadge category={post.category} size="small" />
        </div>
      </Link>

      {/* Content Container */}
      <div className="flex-1 p-6 flex flex-col justify-between">
        <div>
          {/* Metadata Row */}
          <div className="flex items-center space-x-3 text-xs text-slate-400 mb-3">
            <span>{formattedDate}</span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>{post.readingTime || 3} min read</span>
            </span>
          </div>

          {/* Title */}
          <Link to={`/post/${post.slug || post._id}`}>
            <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white line-clamp-2 group-hover:text-inkora-teal transition-colors duration-200 mb-2 leading-snug">
              {post.title}
            </h3>
          </Link>

          {/* Excerpt / Summary */}
          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed mb-6 font-sans">
            {post.summary}
          </p>
        </div>

        {/* Footer: Author & Social Metrics */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
          <Link
            to={`/profile/${post.author?._id}`}
            className="flex items-center space-x-2.5 group/author"
          >
            <img
              src={
                post.author?.avatar ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'
              }
              alt={post.author?.name || 'Author'}
              className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-300 dark:ring-slate-700 group-hover/author:ring-inkora-teal"
            />
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300 group-hover/author:text-inkora-teal transition-colors">
              {post.author?.name || 'INKORA Contributor'}
            </span>
          </Link>

          {/* Quick Metrics */}
          <div className="flex items-center space-x-3 text-xs text-slate-500">
            {post.views > 0 && (
              <span className="flex items-center space-x-1" title="Views">
                <Eye className="w-3.5 h-3.5" />
                <span>{post.views}</span>
              </span>
            )}
            <span className="flex items-center space-x-1" title="Comments">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{post.commentCount || 0}</span>
            </span>
            <span className="flex items-center space-x-1 text-rose-400/80" title="Likes">
              <Heart className="w-3.5 h-3.5" />
              <span>{post.likesCount || 0}</span>
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import CategoryBadge from './CategoryBadge';
import { Clock, ArrowRight, MessageSquare, Heart } from 'lucide-react';

export default function FeaturedArticle({ post }) {
  if (!post) return null;

  const formattedDate = new Date(post.publishedAt || post.createdAt).toLocaleDateString(
    'en-US',
    {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }
  );

  return (
    <div className="relative rounded-3xl overflow-hidden editorial-glass border border-slate-200/80 dark:border-slate-800/90 shadow-2xl p-6 lg:p-10 transition-all duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Cover Photo */}
        <div className="lg:col-span-7">
          <Link
            to={`/post/${post.slug || post._id}`}
            className="group relative block aspect-[16/10] overflow-hidden rounded-2xl bg-slate-950"
          >
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-inkora-navy/80 via-transparent to-transparent opacity-50" />
            <div className="absolute top-4 left-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold tracking-widest uppercase bg-inkora-teal text-inkora-navy shadow-md">
                Featured Editorial
              </span>
            </div>
          </Link>
        </div>

        {/* Story Prose Summary */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-xs text-slate-400">
              <CategoryBadge category={post.category} />
              <span>•</span>
              <span className="flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{post.readingTime || 4} min read</span>
              </span>
            </div>

            <Link to={`/post/${post.slug || post._id}`}>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 dark:text-white hover:text-inkora-teal transition-colors leading-tight">
                {post.title}
              </h2>
            </Link>

            <p className="font-sans text-sm sm:text-base text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
              {post.summary}
            </p>
          </div>

          <div className="pt-8 mt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <Link
              to={`/profile/${post.author?._id}`}
              className="flex items-center space-x-3 group/author"
            >
              <img
                src={
                  post.author?.avatar ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120'
                }
                alt={post.author?.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-inkora-teal/30"
              />
              <div>
                <p className="text-xs font-semibold text-slate-900 dark:text-white group-hover/author:text-inkora-teal transition-colors">
                  {post.author?.name}
                </p>
                <p className="text-[11px] text-slate-500">{formattedDate}</p>
              </div>
            </Link>

            <Link
              to={`/post/${post.slug || post._id}`}
              className="inline-flex items-center space-x-2 text-xs font-semibold px-4 py-2.5 rounded-full bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 hover:bg-inkora-teal dark:hover:bg-inkora-teal dark:hover:text-inkora-navy transition-colors duration-200 shadow-md"
            >
              <span>Read Story</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

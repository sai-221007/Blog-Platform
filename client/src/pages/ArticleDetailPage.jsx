import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { postService } from '../services/postService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ReadingProgress from '../components/blog/ReadingProgress';
import CategoryBadge from '../components/blog/CategoryBadge';
import ShareButtons from '../components/blog/ShareButtons';
import AuthorCard from '../components/blog/AuthorCard';
import ArticleCard from '../components/blog/ArticleCard';
import CommentSection from '../components/comments/CommentSection';
import {
  Clock,
  Heart,
  Bookmark,
  Eye,
  ArrowLeft,
  Calendar,
  Loader2,
  Edit,
  Trash2,
} from 'lucide-react';

export default function ArticleDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [liking, setLiking] = useState(false);

  useEffect(() => {
    let isMounted = true;
    window.scrollTo(0, 0);

    const fetchArticle = async () => {
      setLoading(true);
      try {
        const res = await postService.getPost(slug);
        if (isMounted && res.post) {
          setPost(res.post);
          setIsLiked(res.post.isLiked || false);
          setLikesCount(res.post.likesCount || 0);
          setIsBookmarked(res.post.isBookmarked || false);

          // Fetch related articles
          try {
            const related = await postService.getRelatedPosts(res.post._id);
            if (isMounted) setRelatedPosts(related || []);
          } catch (rErr) {
            console.error('Failed to load related:', rErr);
          }
        }
      } catch (err) {
        console.error('Article not found:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchArticle();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const handleToggleLike = async () => {
    if (!user) {
      showToast('Please sign in to like this article.', 'info');
      navigate('/login');
      return;
    }
    if (liking) return;

    setLiking(true);
    try {
      const res = await postService.toggleLike(post._id);
      setIsLiked(res.isLiked);
      setLikesCount(res.likesCount);
    } catch (err) {
      showToast('Action could not be completed.', 'error');
    } finally {
      setLiking(false);
    }
  };

  const handleToggleBookmark = async () => {
    if (!user) {
      showToast('Please sign in to bookmark articles.', 'info');
      navigate('/login');
      return;
    }
    try {
      const res = await postService.toggleBookmark(post._id);
      setIsBookmarked(res.isBookmarked);
      showToast(res.message, 'success');
    } catch (err) {
      showToast('Action could not be completed.', 'error');
    }
  };

  const handleDeletePost = async () => {
    if (window.confirm('Are you sure you want to permanently delete this article?')) {
      try {
        await postService.deletePost(post._id);
        showToast('Article deleted successfully.', 'success');
        navigate('/dashboard');
      } catch (err) {
        showToast('Failed to delete article.', 'error');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center space-x-3 text-slate-400">
        <Loader2 className="w-8 h-8 text-inkora-teal animate-spin" />
        <span className="text-sm font-sans">Typesetting editorial essay...</span>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="font-serif text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Story Not Found
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          The article you are seeking might have been moved or unpublished.
        </p>
        <Link
          to="/explore"
          className="px-6 py-2.5 rounded-full bg-inkora-teal text-inkora-navy font-semibold text-xs"
        >
          Return to Explore
        </Link>
      </div>
    );
  }

  const isOwner = user && user._id === post.author?._id;
  const isAdmin = user && user.role === 'admin';

  const formattedDate = new Date(post.publishedAt || post.createdAt).toLocaleDateString(
    'en-US',
    {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }
  );

  // Markdown-like parser helper for rendering headers, quotes, paragraphs
  const renderFormattedContent = (rawText) => {
    if (!rawText) return null;

    const sections = rawText.split('\n\n');

    return sections.map((sec, idx) => {
      const trimmed = sec.trim();

      if (trimmed.startsWith('## ')) {
        return (
          <h2 key={idx} className="font-serif text-2xl sm:text-3xl font-bold mt-10 mb-4 text-slate-900 dark:text-white">
            {trimmed.replace('## ', '')}
          </h2>
        );
      }
      if (trimmed.startsWith('### ')) {
        return (
          <h3 key={idx} className="font-serif text-xl sm:text-2xl font-bold mt-8 mb-3 text-inkora-teal">
            {trimmed.replace('### ', '')}
          </h3>
        );
      }
      if (trimmed.startsWith('> ')) {
        return (
          <blockquote key={idx} className="border-l-4 border-inkora-teal pl-6 py-2 my-6 font-serif italic text-lg sm:text-xl text-slate-800 dark:text-slate-200 bg-inkora-teal/5 rounded-r-xl">
            {trimmed.replace('> ', '').replace(/"/g, '')}
          </blockquote>
        );
      }
      if (trimmed.startsWith('```')) {
        const codeLines = trimmed.replace(/^```[a-z]*\n?/, '').replace(/\n?```$/, '');
        return (
          <pre key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-200 overflow-x-auto font-mono my-6">
            <code>{codeLines}</code>
          </pre>
        );
      }
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        const items = trimmed.split('\n').map((li) => li.replace(/^[-*]\s*/, ''));
        return (
          <ul key={idx} className="list-disc list-inside space-y-2 my-4 pl-4 text-slate-700 dark:text-slate-300">
            {items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        );
      }

      return (
        <p key={idx} className="text-base sm:text-lg leading-relaxed text-slate-700 dark:text-slate-300 mb-6 font-serif">
          {trimmed}
        </p>
      );
    });
  };

  return (
    <article className="relative min-h-screen pt-8 pb-24">
      {/* Top Floating Reading Progress Indicator */}
      <ReadingProgress />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation & Back Control */}
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/explore"
            className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-inkora-teal transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Stories</span>
          </Link>

          {(isOwner || isAdmin) && (
            <div className="flex items-center space-x-2">
              <Link
                to={`/edit/${post._id}`}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs rounded-xl editorial-glass text-inkora-teal border border-inkora-teal/30 hover:bg-inkora-teal/10 transition-colors"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit Story</span>
              </Link>
              <button
                onClick={handleDeletePost}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs rounded-xl editorial-glass text-rose-400 border border-rose-500/30 hover:bg-rose-500/10 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>

        {/* Article Header & Editorial Title */}
        <header className="space-y-6 mb-12">
          <div className="flex items-center space-x-3">
            <CategoryBadge category={post.category} />
            <span className="text-slate-500">•</span>
            <span className="flex items-center space-x-1 text-xs text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              <span>{post.readingTime} min read</span>
            </span>
            <span className="text-slate-500">•</span>
            <span className="flex items-center space-x-1 text-xs text-slate-400">
              <Eye className="w-3.5 h-3.5" />
              <span>{post.views} views</span>
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15]">
            {post.title}
          </h1>

          <p className="font-sans text-base sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            {post.summary}
          </p>

          {/* Author Metadata Bar */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <Link
              to={`/profile/${post.author?._id}`}
              className="flex items-center space-x-3 group/author"
            >
              <img
                src={
                  post.author?.avatar ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'
                }
                alt={post.author?.name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-inkora-teal/40 group-hover/author:ring-inkora-teal"
              />
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white group-hover/author:text-inkora-teal transition-colors">
                  {post.author?.name}
                </p>
                <p className="text-xs text-slate-400 flex items-center space-x-1">
                  <Calendar className="w-3 h-3 inline mr-1" />
                  <span>Published on {formattedDate}</span>
                </p>
              </div>
            </Link>

            {/* Social Share & Actions */}
            <div className="flex items-center space-x-3">
              <button
                onClick={handleToggleLike}
                disabled={liking}
                className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  isLiked
                    ? 'bg-rose-500/15 border-rose-500/30 text-rose-400'
                    : 'border-slate-300 dark:border-slate-800 text-slate-400 hover:text-rose-400'
                }`}
                title="Applaud / Like"
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-400' : ''}`} />
                <span>{likesCount}</span>
              </button>

              <button
                onClick={handleToggleBookmark}
                className={`p-2 rounded-full border transition-colors ${
                  isBookmarked
                    ? 'bg-inkora-teal/15 border-inkora-teal/40 text-inkora-teal'
                    : 'border-slate-300 dark:border-slate-800 text-slate-400 hover:text-inkora-teal'
                }`}
                title="Save Bookmark"
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-inkora-teal' : ''}`} />
              </button>

              <ShareButtons title={post.title} />
            </div>
          </div>
        </header>

        {/* Feature Cover Image */}
        <div className="relative aspect-[16/9] rounded-3xl overflow-hidden mb-12 shadow-2xl bg-slate-950">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Article Body Content */}
        <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed font-serif text-lg mb-16">
          {renderFormattedContent(post.content)}
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="pt-6 pb-10 border-t border-slate-200 dark:border-slate-800 flex items-center flex-wrap gap-2">
            <span className="text-xs text-slate-500 mr-2 uppercase tracking-wider font-semibold">
              Tags:
            </span>
            {post.tags.map((tag) => (
              <Link
                key={tag}
                to={`/explore?search=${encodeURIComponent(tag)}`}
                className="text-xs px-3 py-1 rounded-full editorial-glass text-slate-400 hover:text-inkora-teal hover:border-inkora-teal/40 transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}

        {/* Author Bio Box */}
        <div className="my-12">
          <AuthorCard author={post.author} />
        </div>

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <div className="my-16 pt-12 border-t border-slate-200 dark:border-slate-800">
            <h3 className="font-serif text-2xl font-bold text-slate-900 dark:text-white mb-6">
              Further Reading in {post.category}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((rPost) => (
                <ArticleCard key={rPost._id} post={rPost} />
              ))}
            </div>
          </div>
        )}

        {/* Comments Section */}
        <div className="mt-16 pt-12 border-t border-slate-200 dark:border-slate-800">
          <CommentSection postId={post._id} postAuthorId={post.author?._id} />
        </div>
      </div>
    </article>
  );
}

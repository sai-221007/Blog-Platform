import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { userService } from '../services/userService';
import { postService } from '../services/postService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import InkoraCanvas from '../components/three/InkoraCanvas';
import {
  FileText,
  Clock,
  MessageSquare,
  Eye,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Search,
  Loader2,
  CheckCircle,
  FileEdit,
} from 'lucide-react';

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const currentTab = searchParams.get('tab') || 'published'; // 'published' or 'drafts'
  const [stats, setStats] = useState({
    totalPublished: 0,
    totalDrafts: 0,
    totalViews: 0,
    totalLikes: 0,
    totalCommentsReceived: 0,
  });
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Protect route
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const data = await userService.getDashboard();
      if (data) {
        setStats(data.stats);
        setPosts(data.posts || []);
      }
    } catch (err) {
      showToast('Failed to load dashboard records.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated]);

  const handleDelete = async (postId) => {
    if (window.confirm('Are you sure you want to permanently delete this article?')) {
      try {
        await postService.deletePost(postId);
        setPosts((prev) => prev.filter((p) => p._id !== postId));
        showToast('Article deleted successfully.', 'success');
        // Update stats
        fetchDashboardData();
      } catch (err) {
        showToast('Failed to delete post.', 'error');
      }
    }
  };

  const filteredPosts = posts.filter((post) => {
    const matchesTab =
      currentTab === 'drafts' ? post.status === 'draft' : post.status === 'published';
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="relative min-h-screen pt-10 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <InkoraCanvas variant="subtle" />

      <div className="relative z-10 space-y-10">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Publishing Workspace
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Welcome back, {user?.name}. Manage your published manuscripts, drafts, and readership.
            </p>
          </div>

          <Link
            to="/write"
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-inkora-teal text-inkora-navy font-bold text-xs hover:bg-inkora-teal/90 transition-all shadow-lg shadow-inkora-teal/20"
          >
            <Plus className="w-4 h-4" />
            <span>Write New Story</span>
          </Link>
        </div>

        {/* Real Calculated Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-6 rounded-2xl editorial-glass border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between text-inkora-teal mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Published
              </span>
              <CheckCircle className="w-4 h-4" />
            </div>
            <p className="font-serif text-3xl font-bold text-slate-900 dark:text-white">
              {stats.totalPublished}
            </p>
            <span className="text-[11px] text-slate-500">Live stories</span>
          </div>

          <div className="p-6 rounded-2xl editorial-glass border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between text-inkora-amber mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Drafts
              </span>
              <FileEdit className="w-4 h-4" />
            </div>
            <p className="font-serif text-3xl font-bold text-slate-900 dark:text-white">
              {stats.totalDrafts}
            </p>
            <span className="text-[11px] text-slate-500">Unpublished drafts</span>
          </div>

          <div className="p-6 rounded-2xl editorial-glass border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between text-teal-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Total Reads
              </span>
              <Eye className="w-4 h-4" />
            </div>
            <p className="font-serif text-3xl font-bold text-slate-900 dark:text-white">
              {stats.totalViews.toLocaleString()}
            </p>
            <span className="text-[11px] text-slate-500">Article impressions</span>
          </div>

          <div className="p-6 rounded-2xl editorial-glass border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between text-sky-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Discussions
              </span>
              <MessageSquare className="w-4 h-4" />
            </div>
            <p className="font-serif text-3xl font-bold text-slate-900 dark:text-white">
              {stats.totalCommentsReceived}
            </p>
            <span className="text-[11px] text-slate-500">Reader responses</span>
          </div>
        </div>

        {/* Post Management Workspace Table */}
        <div className="p-6 rounded-3xl editorial-glass border border-slate-200 dark:border-slate-800 space-y-6">
          {/* Tabs & Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setSearchParams({ tab: 'published' })}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  currentTab === 'published'
                    ? 'bg-inkora-teal text-inkora-navy font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Published Stories ({stats.totalPublished})
              </button>
              <button
                onClick={() => setSearchParams({ tab: 'drafts' })}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  currentTab === 'drafts'
                    ? 'bg-inkora-teal text-inkora-navy font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Working Drafts ({stats.totalDrafts})
              </button>
            </div>

            {/* Quick Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Filter stories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-4 py-1.5 text-xs rounded-xl bg-slate-100 dark:bg-inkora-surface border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-inkora-teal"
              />
            </div>
          </div>

          {/* Table / List */}
          {loading ? (
            <div className="py-16 text-center text-slate-400 flex items-center justify-center space-x-2">
              <Loader2 className="w-5 h-5 text-inkora-teal animate-spin" />
              <span className="text-xs">Loading articles...</span>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="py-16 text-center border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl">
              <p className="text-sm text-slate-400 font-serif mb-2">
                No {currentTab} stories found.
              </p>
              <Link
                to="/write"
                className="text-xs font-semibold text-inkora-teal hover:underline"
              >
                Create a new article now →
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-200 dark:divide-slate-800">
              {filteredPosts.map((post) => (
                <div
                  key={post._id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-900/30 px-3 rounded-xl transition-colors"
                >
                  <div className="flex items-start space-x-4">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-16 h-12 rounded-lg object-cover bg-slate-950 shrink-0"
                    />
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-inkora-teal px-2 py-0.5 rounded bg-inkora-teal/10">
                          {post.category}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {new Date(post.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <Link
                        to={`/post/${post.slug || post._id}`}
                        className="font-serif text-base font-bold text-slate-900 dark:text-white hover:text-inkora-teal transition-colors line-clamp-1"
                      >
                        {post.title}
                      </Link>
                      <div className="flex items-center space-x-4 text-[11px] text-slate-500 mt-1">
                        <span>{post.views} views</span>
                        <span>•</span>
                        <span>{post.commentCount || 0} comments</span>
                        <span>•</span>
                        <span>{post.readingTime} min read</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 shrink-0">
                    <Link
                      to={`/post/${post.slug || post._id}`}
                      className="p-2 rounded-lg editorial-glass hover:text-inkora-teal text-slate-400 transition-colors"
                      title="View Article"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                    <Link
                      to={`/edit/${post._id}`}
                      className="p-2 rounded-lg editorial-glass hover:text-inkora-teal text-slate-400 transition-colors"
                      title="Edit Article"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="p-2 rounded-lg editorial-glass hover:text-rose-400 text-slate-400 transition-colors"
                      title="Delete Article"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

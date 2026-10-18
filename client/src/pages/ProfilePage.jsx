import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { userService } from '../services/userService';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ArticleCard from '../components/blog/ArticleCard';
import InkoraCanvas from '../components/three/InkoraCanvas';
import {
  Calendar,
  BookOpen,
  Eye,
  Edit3,
  Check,
  X,
  Loader2,
  PenSquare,
} from 'lucide-react';

export default function ProfilePage() {
  const { id } = useParams();
  const { user: currentUser, updateUser } = useAuth();
  const { showToast } = useToast();

  const [profileUser, setProfileUser] = useState(null);
  const [stats, setStats] = useState({ publishedCount: 0, totalViews: 0 });
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit Profile Modal State
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');
  const [updating, setUpdating] = useState(false);

  const isOwnProfile = currentUser && currentUser._id === id;

  useEffect(() => {
    let isMounted = true;
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const [profileRes, userPosts] = await Promise.all([
          userService.getUserProfile(id),
          userService.getUserPosts(id),
        ]);

        if (isMounted) {
          setProfileUser(profileRes.user);
          setStats(profileRes.stats || { publishedCount: 0, totalViews: 0 });
          setPosts(userPosts || []);

          if (profileRes.user) {
            setName(profileRes.user.name || '');
            setBio(profileRes.user.bio || '');
            setAvatar(profileRes.user.avatar || '');
          }
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (id) {
      fetchProfile();
    }

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const res = await authService.updateProfile({ name, bio, avatar });
      setProfileUser(res.user);
      updateUser(res.user);
      setIsEditing(false);
      showToast('Profile updated successfully.', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update profile.', 'error');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center space-x-3 text-slate-400">
        <Loader2 className="w-8 h-8 text-inkora-teal animate-spin" />
        <span className="text-sm font-sans">Loading author portfolio...</span>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="font-serif text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Author Not Found
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          The requested profile does not exist on INKORA.
        </p>
        <Link
          to="/explore"
          className="px-6 py-2.5 rounded-full bg-inkora-teal text-inkora-navy font-semibold text-xs"
        >
          Explore Other Writers
        </Link>
      </div>
    );
  }

  const joinDate = new Date(profileUser.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="relative min-h-screen pt-12 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <InkoraCanvas variant="subtle" />

      <div className="relative z-10 space-y-12">
        {/* Profile Header Hero Card */}
        <div className="p-8 lg:p-12 rounded-3xl editorial-glass border border-slate-200 dark:border-slate-800 relative">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <img
              src={
                profileUser.avatar ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'
              }
              alt={profileUser.name}
              className="w-28 h-28 rounded-full object-cover ring-4 ring-inkora-teal/30 shadow-2xl shrink-0"
            />

            <div className="flex-1 text-center md:text-left space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="flex items-center justify-center md:justify-start space-x-3">
                    <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                      {profileUser.name}
                    </h1>
                    <span className="text-xs font-bold uppercase tracking-wider text-inkora-teal px-2.5 py-0.5 rounded-full bg-inkora-teal/10">
                      {profileUser.role}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 flex items-center justify-center md:justify-start space-x-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Member of INKORA since {joinDate}</span>
                  </p>
                </div>

                {isOwnProfile && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl editorial-glass text-xs font-semibold text-inkora-teal border border-inkora-teal/30 hover:bg-inkora-teal/10 transition-colors w-fit mx-auto md:mx-0"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Profile</span>
                  </button>
                )}
              </div>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-sans max-w-2xl leading-relaxed">
                {profileUser.bio || 'Contributing essayist and thinker on INKORA.'}
              </p>

              {/* Author Metrics */}
              <div className="flex items-center justify-center md:justify-start space-x-6 pt-2 text-xs text-slate-400">
                <span className="flex items-center space-x-1.5">
                  <BookOpen className="w-4 h-4 text-inkora-teal" />
                  <span>
                    <strong className="text-slate-900 dark:text-white">{stats.publishedCount}</strong>{' '}
                    Articles
                  </span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <Eye className="w-4 h-4 text-inkora-amber" />
                  <span>
                    <strong className="text-slate-900 dark:text-white">
                      {stats.totalViews.toLocaleString()}
                    </strong>{' '}
                    Reads
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Profile Modal */}
        {isEditing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-md p-6 rounded-3xl editorial-glass border border-slate-700 shadow-2xl animate-in zoom-in-95">
              <div className="flex items-center justify-between pb-4 border-b border-slate-700 mb-4">
                <h3 className="font-serif text-lg font-bold text-white">Edit Your Profile</h3>
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full p-2.5 text-xs rounded-xl bg-inkora-surface border border-slate-700 text-white focus:outline-none focus:border-inkora-teal"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Avatar Image URL
                  </label>
                  <input
                    type="url"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full p-2.5 text-xs rounded-xl bg-inkora-surface border border-slate-700 text-white focus:outline-none focus:border-inkora-teal"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Short Biography
                  </label>
                  <textarea
                    rows={3}
                    maxLength={300}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl bg-inkora-surface border border-slate-700 text-white focus:outline-none focus:border-inkora-teal resize-none"
                  />
                </div>

                <div className="flex items-center justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 rounded-xl border border-slate-700 text-xs font-semibold text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updating}
                    className="px-5 py-2 rounded-xl bg-inkora-teal text-inkora-navy font-bold text-xs hover:bg-inkora-teal/90"
                  >
                    {updating ? 'Saving...' : 'Save Profile'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Published Stories Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
            <h2 className="font-serif text-2xl font-bold text-slate-900 dark:text-white">
              Published by {profileUser.name?.split(' ')[0]}
            </h2>
            <span className="text-xs text-slate-400">{posts.length} stories</span>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-20 editorial-glass rounded-3xl p-8">
              <p className="font-serif text-lg text-slate-400 mb-2">
                No stories published by this author yet.
              </p>
              {isOwnProfile && (
                <Link
                  to="/write"
                  className="inline-flex items-center space-x-1.5 text-xs font-semibold text-inkora-teal hover:underline"
                >
                  <PenSquare className="w-3.5 h-3.5" />
                  <span>Write your first story →</span>
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <ArticleCard key={post._id} post={post} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

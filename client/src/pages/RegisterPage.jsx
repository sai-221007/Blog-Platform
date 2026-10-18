import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Logo from '../components/branding/Logo';
import InkoraCanvas from '../components/three/InkoraCanvas';
import { Eye, EyeOff, Lock, Mail, User, ArrowRight, Loader2, Compass, Sparkles } from 'lucide-react';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, login } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState('');
  const [role, setRole] = useState('author');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    if (password.length < 6) {
      showToast('Password must be at least 6 characters.', 'error');
      return;
    }

    setLoading(true);
    try {
      await register({ name, email, password, bio, role });
      showToast('Account created successfully! Welcome to INKORA.', 'success');
      navigate('/dashboard');
    } catch (err) {
      showToast(err.response?.data?.message || 'Registration failed. Try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (demoRole) => {
    setLoading(true);
    try {
      if (demoRole === 'author') {
        await login('demo@inkora.com', 'Password123!');
      } else {
        await login('admin@inkora.com', 'AdminPassword123!');
      }
      showToast('Welcome to INKORA Workspace.', 'success');
      navigate('/dashboard');
    } catch (err) {
      showToast('Demo authentication failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[92vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      {/* Dynamic 3D Real-time Canvas */}
      <InkoraCanvas variant="hero" />

      <div className="relative z-10 w-full max-w-md space-y-6 p-8 sm:p-10 rounded-3xl editorial-glass border border-slate-200 dark:border-slate-800 shadow-2xl animate-in fade-in zoom-in-95">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-3">
            <Logo size="large" showTagline={false} />
          </div>
          <h1 className="font-serif text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Join the Collective
          </h1>
          <p className="text-xs text-slate-400">
            Publish your essays, engage with visionary thinkers, and leave your mark.
          </p>
        </div>

        {/* Quick Demo Access Bar */}
        <div className="p-3 rounded-2xl bg-inkora-teal/5 border border-inkora-teal/20 text-center space-y-1.5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-inkora-teal">
            Instant Demo Sign-In:
          </p>
          <div className="flex items-center justify-center space-x-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('author')}
              disabled={loading}
              className="text-[11px] px-3 py-1 rounded-lg bg-inkora-teal/15 hover:bg-inkora-teal/25 text-inkora-teal font-medium transition-colors"
            >
              Julian Cross (Author)
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              disabled={loading}
              className="text-[11px] px-3 py-1 rounded-lg bg-inkora-amber/15 hover:bg-inkora-amber/25 text-inkora-amber font-medium transition-colors"
            >
              Editorial Admin
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Full Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Julian Cross"
                required
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-100 dark:bg-inkora-surface border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-inkora-teal"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="author@inkora.com"
                required
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-100 dark:bg-inkora-surface border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-inkora-teal"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Password (min 6 characters) *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-100 dark:bg-inkora-surface border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-inkora-teal"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3.5 top-2.5 text-slate-400 hover:text-white"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Writer Bio / Research Focus
            </label>
            <textarea
              rows={2}
              maxLength={200}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Architectural systems, typography research, or computational essays."
              className="w-full p-2.5 text-xs rounded-xl bg-slate-100 dark:bg-inkora-surface border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-inkora-teal resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-inkora-teal text-inkora-navy font-bold text-xs uppercase tracking-wider hover:bg-inkora-teal/90 transition-all shadow-lg shadow-inkora-teal/20 flex items-center justify-center space-x-2 mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Begin Publishing</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex flex-col space-y-2 text-center text-xs">
          <p className="text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-inkora-teal font-semibold hover:underline">
              Sign In
            </Link>
          </p>
          <p className="text-slate-500">
            Want to explore first?{' '}
            <Link to="/home" className="text-slate-300 font-semibold hover:text-inkora-teal underline inline-flex items-center space-x-1">
              <span>Continue to Stories as Guest</span>
              <Compass className="w-3.5 h-3.5 inline ml-1" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Logo from '../components/branding/Logo';
import InkoraCanvas from '../components/three/InkoraCanvas';
import { Eye, EyeOff, Lock, Mail, ArrowRight, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please fill in both email and password.', 'error');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      showToast('Welcome back to INKORA.', 'success');
      navigate(from, { replace: true });
    } catch (err) {
      showToast(err.response?.data?.message || 'Invalid credentials. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = (role) => {
    if (role === 'author') {
      setEmail('demo@inkora.com');
      setPassword('Password123!');
    } else {
      setEmail('admin@inkora.com');
      setPassword('AdminPassword123!');
    }
  };

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
      <InkoraCanvas variant="subtle" />

      <div className="relative z-10 w-full max-w-md space-y-8 p-8 sm:p-10 rounded-3xl editorial-glass border border-slate-200 dark:border-slate-800 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <Logo size="large" />
          </div>
          <h2 className="font-serif text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Sign In to INKORA
          </h2>
          <p className="text-xs text-slate-400">
            Access your author dashboard, draft stories, and reader responses.
          </p>
        </div>

        {/* Quick Demo Fill Box */}
        <div className="p-3.5 rounded-2xl bg-inkora-teal/5 border border-inkora-teal/20 text-center space-y-2">
          <p className="text-[11px] font-semibold text-inkora-teal uppercase tracking-wider">
            Quick Demo Access:
          </p>
          <div className="flex items-center justify-center space-x-2">
            <button
              type="button"
              onClick={() => fillDemoAccount('author')}
              className="text-[11px] px-3 py-1 rounded-lg bg-inkora-teal/15 hover:bg-inkora-teal/25 text-inkora-teal font-medium transition-colors"
            >
              Demo Author (Julian)
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount('admin')}
              className="text-[11px] px-3 py-1 rounded-lg bg-inkora-amber/15 hover:bg-inkora-amber/25 text-inkora-amber font-medium transition-colors"
            >
              Editorial Admin
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Email Address
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
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
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

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-inkora-teal text-inkora-navy font-bold text-xs uppercase tracking-wider hover:bg-inkora-teal/90 transition-all shadow-lg shadow-inkora-teal/20 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Enter Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400">
          New to the platform?{' '}
          <Link to="/register" className="text-inkora-teal font-semibold hover:underline">
            Create an Account
          </Link>
        </p>
      </div>
    </div>
  );
}

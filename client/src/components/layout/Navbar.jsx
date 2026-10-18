import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import Logo from '../branding/Logo';
import AmbianceSelector from '../ui/AmbianceSelector';
import {
  Search,
  Sun,
  Moon,
  PenSquare,
  User,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  ChevronDown,
  BookOpen,
} from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { showToast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleLogout = async () => {
    await logout();
    showToast('Signed out successfully. Until next time.', 'info');
    navigate('/');
  };

  const navLinks = [
    { label: 'Home', path: '/home' },
    { label: 'Explore', path: '/explore' },
    { label: 'Categories', path: '/categories' },
    { label: 'About', path: '/about' },
  ];

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-inkora-navy/85 dark:bg-inkora-navy/85 light:bg-white/85 backdrop-blur-xl border-b border-inkora-borderLight dark:border-inkora-borderDark shadow-lg'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Logo showTagline={false} size="default" />

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive =
                location.pathname === link.path ||
                (link.path === '/home' && location.pathname === '/');
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium tracking-wide transition-colors duration-200 relative py-1 ${
                    isActive
                      ? 'text-inkora-teal font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-inkora-teal dark:hover:text-inkora-teal'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-inkora-teal rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search Input or Toggle */}
            {searchOpen ? (
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-56 pl-9 pr-8 py-1.5 text-xs rounded-full bg-slate-100 dark:bg-inkora-surface border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-inkora-teal"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="absolute right-2.5 text-slate-400 hover:text-slate-200 text-xs"
                >
                  ✕
                </button>
              </form>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:text-inkora-teal dark:hover:text-inkora-teal transition-colors"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>
            )}

            {/* 3D Animated Background Theme Selector */}
            <AmbianceSelector compact={true} />

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:text-inkora-teal dark:hover:text-inkora-teal hover:bg-slate-200/50 dark:hover:bg-inkora-surface transition-colors"
              aria-label="Toggle color theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* Write Button */}
            <Link
              to={isAuthenticated ? '/write' : '/login'}
              className="inline-flex items-center space-x-2 text-xs font-semibold px-4 py-2 rounded-full border border-inkora-teal/30 text-inkora-teal hover:bg-inkora-teal/10 transition-all duration-200"
            >
              <PenSquare className="w-3.5 h-3.5" />
              <span>Write</span>
            </Link>

            {/* Auth Profile Menu or Sign In */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen((prev) => !prev)}
                  className="flex items-center space-x-2 p-1 pl-2 rounded-full border border-slate-300 dark:border-slate-800 hover:border-inkora-teal/40 transition-colors"
                >
                  <img
                    src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                    alt={user?.name}
                    className="w-7 h-7 rounded-full object-cover ring-1 ring-inkora-teal/40"
                  />
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-200 max-w-[90px] truncate">
                    {user?.name?.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 pr-1" />
                </button>

                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 rounded-2xl editorial-glass shadow-2xl py-2 z-50 border border-slate-200 dark:border-slate-800 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-800">
                      <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                        {user?.name}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {user?.email}
                      </p>
                    </div>

                    <Link
                      to="/dashboard"
                      className="flex items-center space-x-2 px-4 py-2.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-inkora-teal/10 hover:text-inkora-teal transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span>Author Dashboard</span>
                    </Link>

                    <Link
                      to={`/profile/${user?._id}`}
                      className="flex items-center space-x-2 px-4 py-2.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-inkora-teal/10 hover:text-inkora-teal transition-colors"
                    >
                      <User className="w-4 h-4" />
                      <span>My Profile</span>
                    </Link>

                    <Link
                      to="/dashboard?tab=drafts"
                      className="flex items-center space-x-2 px-4 py-2.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-inkora-teal/10 hover:text-inkora-teal transition-colors"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>Drafts & Stories</span>
                    </Link>

                    <div className="border-t border-slate-200 dark:border-slate-800 my-1" />

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-xs text-rose-500 hover:bg-rose-500/10 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-inkora-teal transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-xs font-semibold px-4 py-2 rounded-full bg-inkora-teal text-inkora-navy hover:bg-inkora-teal/90 shadow-md shadow-inkora-teal/20 transition-all duration-200"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-2 md:hidden">
            <AmbianceSelector compact={true} />
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-slate-600 dark:text-slate-300"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-inkora-teal focus:outline-none"
              aria-label="Open mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden editorial-glass border-b border-slate-200 dark:border-slate-800 px-4 pt-3 pb-6 animate-in slide-in-from-top-5">
          <form onSubmit={handleSearchSubmit} className="mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search INKORA..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm rounded-xl bg-slate-100 dark:bg-inkora-surface border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            </div>
          </form>

          <nav className="flex flex-col space-y-3 mb-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium py-1.5 ${
                  location.pathname === link.path
                    ? 'text-inkora-teal font-semibold'
                    : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {isAuthenticated ? (
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col space-y-3">
              <div className="flex items-center space-x-3 pb-2">
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                  alt={user?.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <p className="text-xs font-semibold text-slate-900 dark:text-white">{user?.name}</p>
                  <p className="text-[11px] text-slate-500">{user?.email}</p>
                </div>
              </div>
              <Link
                to="/write"
                className="w-full text-center py-2.5 rounded-xl bg-inkora-teal text-inkora-navy font-semibold text-xs"
              >
                Write New Story
              </Link>
              <Link
                to="/dashboard"
                className="text-xs font-medium text-slate-700 dark:text-slate-300 py-1"
              >
                Author Dashboard
              </Link>
              <Link
                to={`/profile/${user?._id}`}
                className="text-xs font-medium text-slate-700 dark:text-slate-300 py-1"
              >
                Profile & Published Stories
              </Link>
              <button
                onClick={handleLogout}
                className="text-xs font-medium text-rose-500 py-1 text-left"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center space-x-3">
              <Link
                to="/login"
                className="flex-1 text-center py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="flex-1 text-center py-2.5 rounded-xl bg-inkora-teal text-inkora-navy text-xs font-semibold"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AmbianceSelector from './components/ui/AmbianceSelector';

import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import WriteArticlePage from './pages/WriteArticlePage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import CategoriesPage from './pages/CategoriesPage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';

// Scroll to top helper on navigation
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Initial entry point: When the website is opened, first go to registration page
function RootEntry() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;

  if (isAuthenticated) {
    return <HomePage />;
  }

  // First redirect to registration page on arrival
  return <Navigate to="/register" replace />;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <Router>
            <ScrollToTop />
            <div className="flex flex-col min-h-screen bg-inkora-navy dark:bg-inkora-navy light:bg-inkora-ivory text-inkora-textLight dark:text-inkora-textLight light:text-inkora-textDark transition-colors duration-300">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  {/* First entry point: goes to registration page */}
                  <Route path="/" element={<RootEntry />} />
                  <Route path="/home" element={<HomePage />} />
                  <Route path="/explore" element={<ExplorePage />} />
                  <Route path="/post/:slug" element={<ArticleDetailPage />} />
                  <Route path="/write" element={<WriteArticlePage />} />
                  <Route path="/edit/:id" element={<WriteArticlePage />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/profile/:id" element={<ProfilePage />} />
                  <Route path="/categories" element={<CategoriesPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </main>

              {/* Floating 3D Background Ambiance Switcher Pill */}
              <div className="fixed bottom-6 left-6 z-40 hidden sm:block">
                <AmbianceSelector compact={false} />
              </div>

              <Footer />
            </div>
          </Router>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

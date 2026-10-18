import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../branding/Logo';
import { newsletterService } from '../../services/newsletterService';
import { useToast } from '../../context/ToastContext';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const { showToast } = useToast();

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await newsletterService.subscribe(email);
      setSubscribed(true);
      showToast(res.message || 'Subscribed to INKORA Editorial Dispatch.', 'success');
      setEmail('');
    } catch (err) {
      showToast(err.response?.data?.message || 'Subscription failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'Technology',
    'Design',
    'Programming',
    'Science',
    'Creativity',
    'Lifestyle',
    'Business',
  ];

  return (
    <footer className="relative border-t border-inkora-borderLight dark:border-inkora-borderDark bg-inkora-navy/90 text-slate-400 py-16 px-4 sm:px-6 lg:px-8 mt-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
        {/* Brand Column */}
        <div className="md:col-span-5 space-y-4">
          <Logo size="large" showTagline={true} />
          <p className="text-sm text-slate-400 leading-relaxed max-w-sm pt-2">
            INKORA is an independent editorial publishing collective for architects,
            engineers, scientists, and essayists who believe that words, geometry, and
            ideas leave an indelible mark on the digital world.
          </p>

          {/* Newsletter Form */}
          <div className="pt-4">
            <h4 className="text-xs font-semibold tracking-wider uppercase text-slate-200 mb-2">
              The Sunday Editorial Dispatch
            </h4>
            <p className="text-xs text-slate-400 mb-3">
              One hand-curated essay every Sunday morning. No spam. Pure signal.
            </p>

            {subscribed ? (
              <div className="flex items-center space-x-2 text-xs text-inkora-teal bg-inkora-teal/10 p-3 rounded-xl border border-inkora-teal/20">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>You are subscribed to the INKORA Sunday Dispatch.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex max-w-md">
                <input
                  type="email"
                  placeholder="Enter your email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-2.5 text-xs rounded-l-xl bg-inkora-surface border border-slate-700 text-slate-200 focus:outline-none focus:border-inkora-teal"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2.5 bg-inkora-teal text-inkora-navy font-semibold text-xs rounded-r-xl hover:bg-inkora-teal/90 transition-colors flex items-center space-x-1"
                >
                  <span>{loading ? 'Subscribing...' : 'Join'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Navigation Links */}
        <div className="md:col-span-2 space-y-3">
          <h4 className="text-xs font-semibold tracking-wider uppercase text-slate-200">
            Publishing
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link to="/explore" className="hover:text-inkora-teal transition-colors">
                Explore Stories
              </Link>
            </li>
            <li>
              <Link to="/categories" className="hover:text-inkora-teal transition-colors">
                Category Index
              </Link>
            </li>
            <li>
              <Link to="/write" className="hover:text-inkora-teal transition-colors">
                Start Writing
              </Link>
            </li>
            <li>
              <Link to="/dashboard" className="hover:text-inkora-teal transition-colors">
                Author Dashboard
              </Link>
            </li>
          </ul>
        </div>

        {/* Categories */}
        <div className="md:col-span-3 space-y-3">
          <h4 className="text-xs font-semibold tracking-wider uppercase text-slate-200">
            Editorial Columns
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {categories.map((cat) => (
              <Link
                key={cat}
                to={`/explore?category=${cat}`}
                className="hover:text-inkora-teal transition-colors truncate"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>

        {/* Philosophy & Colophon */}
        <div className="md:col-span-2 space-y-3">
          <h4 className="text-xs font-semibold tracking-wider uppercase text-slate-200">
            Colophon
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link to="/about" className="hover:text-inkora-teal transition-colors">
                Our Manifesto
              </Link>
            </li>
            <li>
              <a
                href="#typography"
                onClick={(e) => {
                  e.preventDefault();
                  alert('INKORA utilizes Newsreader, Playfair Display, and Plus Jakarta Sans.');
                }}
                className="hover:text-inkora-teal transition-colors"
              >
                Typography Spec
              </a>
            </li>
            <li>
              <span className="text-slate-500">Node.js + React + Three.js</span>
            </li>
            <li>
              <span className="inline-flex items-center text-[11px] text-inkora-teal">
                ● 100% Non-AI Conventional Platform
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
        <p>© {new Date().getFullYear()} INKORA Publishing Collective. All rights reserved.</p>
        <p className="mt-2 sm:mt-0 font-serif italic text-slate-400">
          "Ideas Leave a Mark."
        </p>
      </div>
    </footer>
  );
}

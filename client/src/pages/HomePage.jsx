import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import InkoraCanvas from '../components/three/InkoraCanvas';
import FeaturedArticle from '../components/blog/FeaturedArticle';
import ArticleCard from '../components/blog/ArticleCard';
import CategoryBadge from '../components/blog/CategoryBadge';
import { postService } from '../services/postService';
import {
  ArrowRight,
  Sparkles,
  BookOpen,
  Users,
  MessageSquare,
  TrendingUp,
  Compass,
  Feather,
} from 'lucide-react';

export default function HomePage() {
  const [featuredPost, setFeaturedPost] = useState(null);
  const [latestPosts, setLatestPosts] = useState([]);
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [stats, setStats] = useState({
    totalArticles: 0,
    totalAuthors: 0,
    totalComments: 0,
    totalViews: 0,
  });
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    'All',
    'Technology',
    'Design',
    'Programming',
    'Science',
    'Creativity',
    'Lifestyle',
    'Business',
  ];

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [featured, latestRes, trending, statsData] = await Promise.all([
          postService.getFeaturedPost(),
          postService.getPosts({ limit: 6, sort: 'newest' }),
          postService.getTrendingPosts(),
          postService.getPlatformStats(),
        ]);

        setFeaturedPost(featured);
        setLatestPosts(latestRes.posts || []);
        setTrendingPosts(trending || []);
        if (statsData) setStats(statsData);
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const filteredPosts =
    selectedCategory === 'All'
      ? latestPosts
      : latestPosts.filter((p) => p.category === selectedCategory);

  return (
    <div className="relative min-h-screen">
      {/* Real-time Cinematic 3D Canvas Background */}
      <InkoraCanvas variant="hero" />

      {/* Main Content Foreground */}
      <div className="relative z-10 space-y-24">
        {/* HERO SECTION */}
        <section className="pt-20 pb-16 sm:pt-28 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full editorial-glass text-xs font-semibold text-inkora-teal mb-8 shadow-sm">
            <Feather className="w-3.5 h-3.5" />
            <span className="tracking-widest uppercase text-[11px]">Editorial Publishing Platform</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-[1.12]">
            Every Story Starts <span className="text-inkora-teal italic">Somewhere.</span>
          </h1>

          <p className="mt-6 text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-sans leading-relaxed">
            INKORA is a refined editorial stage for visionaries, technologists, and thinkers.
            Craft long-form essays, explore enduring ideas, and leave your mark.
          </p>

          {/* Call to Actions */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/write"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-inkora-teal text-inkora-navy font-bold text-sm hover:bg-inkora-teal/90 transition-all duration-300 shadow-xl shadow-inkora-teal/20 flex items-center justify-center space-x-2"
            >
              <span>Start Writing</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/explore"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full editorial-glass text-slate-800 dark:text-slate-200 font-semibold text-sm hover:border-inkora-teal/40 transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <Compass className="w-4 h-4 text-inkora-teal" />
              <span>Explore Stories</span>
            </Link>
          </div>

          {/* Real Editorial Statistics */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-4 rounded-2xl editorial-glass text-center">
              <p className="font-serif text-2xl sm:text-3xl font-bold text-inkora-teal">
                {stats.totalArticles}
              </p>
              <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500 mt-1">
                Published Essays
              </p>
            </div>
            <div className="p-4 rounded-2xl editorial-glass text-center">
              <p className="font-serif text-2xl sm:text-3xl font-bold text-inkora-amber">
                {stats.totalAuthors}
              </p>
              <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500 mt-1">
                Curated Authors
              </p>
            </div>
            <div className="p-4 rounded-2xl editorial-glass text-center">
              <p className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                {stats.totalComments}
              </p>
              <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500 mt-1">
                Discussions
              </p>
            </div>
            <div className="p-4 rounded-2xl editorial-glass text-center">
              <p className="font-serif text-2xl sm:text-3xl font-bold text-inkora-teal">
                {stats.totalViews.toLocaleString()}
              </p>
              <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500 mt-1">
                Total Reads
              </p>
            </div>
          </div>
        </section>

        {/* FEATURED EDITORIAL SECTION */}
        {featuredPost && (
          <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                  Curator's Spotlight
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Our premier essay of the week, selected for intellectual depth and craft
                </p>
              </div>
            </div>

            <FeaturedArticle post={featuredPost} />
          </section>
        )}

        {/* LATEST STORIES & CATEGORY FILTER */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                Latest Published Stories
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Fresh perspectives from across technology, design, science, and the humanities
              </p>
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-xs px-3.5 py-1.5 rounded-full font-medium transition-all whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-inkora-teal text-inkora-navy font-bold shadow-sm'
                      : 'editorial-glass text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Article Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="aspect-[16/10] rounded-2xl editorial-glass animate-pulse" />
              ))}
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-16 editorial-glass rounded-3xl">
              <p className="text-base font-serif text-slate-400">
                No stories found in this category yet.
              </p>
              <Link
                to="/write"
                className="mt-3 inline-block text-xs font-semibold text-inkora-teal underline"
              >
                Be the first to publish in {selectedCategory} →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <ArticleCard key={post._id} post={post} />
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <Link
              to="/explore"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-full editorial-glass text-xs font-semibold text-slate-800 dark:text-slate-200 hover:border-inkora-teal/50 hover:text-inkora-teal transition-all"
            >
              <span>View All Published Stories</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* TRENDING STORIES SECTION */}
        {trendingPosts.length > 0 && (
          <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="p-8 lg:p-12 rounded-3xl editorial-glass border border-slate-200 dark:border-slate-800">
              <div className="flex items-center space-x-3 mb-8">
                <div className="p-2 rounded-xl bg-inkora-amber/10 text-inkora-amber">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-2xl font-bold text-slate-900 dark:text-white">
                    Trending Discussions
                  </h3>
                  <p className="text-xs text-slate-500">
                    Most read and discussed essays across the platform this month
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {trendingPosts.slice(0, 3).map((post, index) => (
                  <Link
                    key={post._id}
                    to={`/post/${post.slug || post._id}`}
                    className="group p-5 rounded-2xl bg-slate-900/40 hover:bg-slate-900/70 border border-slate-800/80 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <span className="font-serif text-3xl font-extrabold text-slate-700 group-hover:text-inkora-teal transition-colors">
                        0{index + 1}
                      </span>
                      <h4 className="font-serif text-base font-bold text-slate-900 dark:text-white group-hover:text-inkora-teal transition-colors mt-2 line-clamp-2">
                        {post.title}
                      </h4>
                      <p className="text-xs text-slate-400 mt-2 line-clamp-2 font-sans">
                        {post.summary}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                      <span>{post.author?.name}</span>
                      <span>{post.views} reads</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

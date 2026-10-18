import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { postService } from '../services/postService';
import ArticleCard from '../components/blog/ArticleCard';
import InkoraCanvas from '../components/three/InkoraCanvas';
import { useDebounce } from '../hooks/useDebounce';
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight, Loader2, X } from 'lucide-react';

export default function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || 'All';
  const initialSort = searchParams.get('sort') || 'newest';
  const initialPage = parseInt(searchParams.get('page') || '1', 10);

  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState(initialSort);
  const [page, setPage] = useState(initialPage);

  const [posts, setPosts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const debouncedSearch = useDebounce(search, 400);

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

  // Sync state to URL
  useEffect(() => {
    const params = {};
    if (debouncedSearch) params.search = debouncedSearch;
    if (category && category !== 'All') params.category = category;
    if (sort && sort !== 'newest') params.sort = sort;
    if (page > 1) params.page = page.toString();

    setSearchParams(params, { replace: true });
  }, [debouncedSearch, category, sort, page, setSearchParams]);

  // Fetch posts from backend with debounced search
  useEffect(() => {
    let isMounted = true;
    const fetchExplorePosts = async () => {
      setLoading(true);
      try {
        const queryParams = {
          page,
          limit: 9,
          sort,
        };
        if (debouncedSearch) queryParams.search = debouncedSearch;
        if (category && category !== 'All') queryParams.category = category;

        const res = await postService.getPosts(queryParams);
        if (isMounted) {
          setPosts(res.posts || []);
          setTotalPages(res.totalPages || 1);
          setTotalCount(res.total || 0);
        }
      } catch (err) {
        console.error('Failed to fetch posts:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchExplorePosts();

    return () => {
      isMounted = false;
    };
  }, [debouncedSearch, category, sort, page]);

  // Reset page when search or category changes
  const handleCategoryChange = (cat) => {
    setCategory(cat);
    setPage(1);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const clearFilters = () => {
    setSearch('');
    setCategory('All');
    setSort('newest');
    setPage(1);
  };

  const hasActiveFilters = search || category !== 'All' || sort !== 'newest';

  return (
    <div className="relative min-h-screen pt-12 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Subtle 3D background */}
      <InkoraCanvas variant="subtle" />

      <div className="relative z-10 space-y-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Explore the Collective
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-sans">
            Dive into articles, architectural thoughts, code essays, and creative philosophy.
          </p>
        </div>

        {/* Search & Filter Controls Bar */}
        <div className="p-6 rounded-3xl editorial-glass border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="flex flex-col md:flex-row items-center gap-4">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by title, concepts, or tags..."
                value={search}
                onChange={handleSearchChange}
                className="w-full pl-11 pr-10 py-3 text-xs sm:text-sm rounded-2xl bg-slate-100 dark:bg-inkora-surface border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-inkora-teal font-sans"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white text-xs"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort Selector */}
            <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
              <SlidersHorizontal className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
                className="px-4 py-3 text-xs sm:text-sm rounded-2xl bg-slate-100 dark:bg-inkora-surface border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-inkora-teal font-sans cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="popular">Most Read</option>
                <option value="mostLiked">Most Appreciated</option>
              </select>
            </div>
          </div>

          {/* Category Chips Bar */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`text-xs px-4 py-2 rounded-full font-medium transition-all whitespace-nowrap ${
                  category === cat
                    ? 'bg-inkora-teal text-inkora-navy font-bold shadow-md shadow-inkora-teal/20'
                    : 'editorial-glass text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Active Filter Indicators */}
          {hasActiveFilters && (
            <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800/80 text-xs text-slate-400">
              <span>
                Found <strong>{totalCount}</strong> {totalCount === 1 ? 'story' : 'stories'}
                {category !== 'All' && ` in ${category}`}
                {search && ` matching "${search}"`}
              </span>
              <button
                onClick={clearFilters}
                className="text-inkora-teal hover:underline font-medium"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>

        {/* Results Article Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <Loader2 className="w-8 h-8 text-inkora-teal animate-spin" />
            <p className="text-xs text-slate-400 font-sans">Querying editorial repository...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-24 editorial-glass rounded-3xl p-8 space-y-4">
            <h3 className="font-serif text-2xl font-bold text-slate-900 dark:text-white">
              No Articles Found
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto font-sans">
              We couldn't find any stories matching your query. Try different keywords or reset your
              filters.
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-2.5 rounded-full bg-inkora-teal text-inkora-navy font-semibold text-xs hover:bg-inkora-teal/90 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <ArticleCard key={post._id} post={post} />
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-3 pt-8">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2.5 rounded-xl editorial-glass border border-slate-300 dark:border-slate-800 disabled:opacity-30 disabled:cursor-not-allowed hover:text-inkora-teal transition-colors"
              aria-label="Previous Page"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <span className="text-xs text-slate-400 font-medium px-4">
              Page <strong className="text-white">{page}</strong> of{' '}
              <strong className="text-white">{totalPages}</strong>
            </span>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2.5 rounded-xl editorial-glass border border-slate-300 dark:border-slate-800 disabled:opacity-30 disabled:cursor-not-allowed hover:text-inkora-teal transition-colors"
              aria-label="Next Page"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

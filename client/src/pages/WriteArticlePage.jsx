import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { postService } from '../services/postService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  PenSquare,
  Eye,
  Save,
  Send,
  Image as ImageIcon,
  Clock,
  ArrowLeft,
  Loader2,
  FileText,
} from 'lucide-react';

export default function WriteArticlePage() {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Technology');
  const [tags, setTags] = useState('');
  const [coverImage, setCoverImage] = useState(
    'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80'
  );
  const [activeTab, setActiveTab] = useState('write'); // 'write' or 'preview'
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEditMode);

  const categories = [
    'Technology',
    'Design',
    'Programming',
    'Science',
    'Creativity',
    'Lifestyle',
    'Business',
  ];

  const coverPresets = [
    {
      label: 'Minimalist Workspace',
      url: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80',
    },
    {
      label: 'Architectural Concrete',
      url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    },
    {
      label: 'Abstract Geometry',
      url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    },
    {
      label: 'Quantum Prism',
      url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1200&q=80',
    },
    {
      label: 'Type & Parchment',
      url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80',
    },
  ];

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      showToast('You must be signed in to write stories.', 'info');
      navigate('/login');
    }
  }, [isAuthenticated, navigate, showToast]);

  // Load article if editing
  useEffect(() => {
    if (isEditMode) {
      const loadPost = async () => {
        try {
          const res = await postService.getPost(id);
          const p = res.post;
          if (p) {
            // Check authorization
            if (p.author?._id !== user?._id && user?.role !== 'admin') {
              showToast('You are not authorized to edit this article.', 'error');
              navigate('/dashboard');
              return;
            }
            setTitle(p.title);
            setSummary(p.summary);
            setContent(p.content);
            setCategory(p.category);
            setTags(Array.isArray(p.tags) ? p.tags.join(', ') : '');
            setCoverImage(p.coverImage);
          }
        } catch (err) {
          showToast('Failed to load article for editing.', 'error');
          navigate('/dashboard');
        } finally {
          setLoading(false);
        }
      };
      loadPost();
    }
  }, [id, isEditMode, user, navigate, showToast]);

  // Calculate metrics
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const estimatedReadingTime = Math.max(1, Math.ceil(wordCount / 200));

  const handleSave = async (status = 'published') => {
    if (!title.trim()) {
      showToast('Please provide an article title.', 'error');
      return;
    }
    if (!summary.trim()) {
      showToast('Please provide a brief excerpt or summary.', 'error');
      return;
    }
    if (!content.trim()) {
      showToast('Article content cannot be empty.', 'error');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: title.trim(),
        summary: summary.trim(),
        content: content.trim(),
        category,
        tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
        coverImage,
        status,
      };

      if (isEditMode) {
        await postService.updatePost(id, payload);
        showToast(
          status === 'draft' ? 'Draft updated successfully.' : 'Article published successfully.',
          'success'
        );
      } else {
        await postService.createPost(payload);
        showToast(
          status === 'draft' ? 'Saved as draft.' : 'Story published to INKORA!',
          'success'
        );
      }
      navigate('/dashboard');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save article.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center space-x-3 text-slate-400">
        <Loader2 className="w-8 h-8 text-inkora-teal animate-spin" />
        <span className="text-sm">Retrieving article workspace...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-8 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Top Bar Navigation & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-slate-200 dark:border-slate-800 gap-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Discard & Back</span>
        </button>

        <div className="flex items-center space-x-3">
          {/* Mode Tabs */}
          <div className="flex items-center rounded-xl p-1 editorial-glass border border-slate-300 dark:border-slate-800">
            <button
              onClick={() => setActiveTab('write')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center space-x-1.5 ${
                activeTab === 'write'
                  ? 'bg-inkora-teal text-inkora-navy'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <PenSquare className="w-3.5 h-3.5" />
              <span>Compose</span>
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center space-x-1.5 ${
                activeTab === 'preview'
                  ? 'bg-inkora-teal text-inkora-navy'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Live Preview</span>
            </button>
          </div>

          {/* Save Draft */}
          <button
            onClick={() => handleSave('draft')}
            disabled={saving}
            className="px-4 py-2 rounded-xl editorial-glass border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-inkora-teal hover:border-inkora-teal/40 transition-colors flex items-center space-x-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Draft</span>
          </button>

          {/* Publish Action */}
          <button
            onClick={() => handleSave('published')}
            disabled={saving}
            className="px-5 py-2 rounded-xl bg-inkora-teal text-inkora-navy font-bold text-xs hover:bg-inkora-teal/90 transition-all shadow-md shadow-inkora-teal/20 flex items-center space-x-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{saving ? 'Publishing...' : isEditMode ? 'Update Story' : 'Publish Story'}</span>
          </button>
        </div>
      </div>

      {activeTab === 'write' ? (
        <div className="space-y-8">
          {/* Article Title Input */}
          <div>
            <textarea
              rows={2}
              placeholder="Title of your essay or story..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-transparent font-serif text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white placeholder:text-slate-500 focus:outline-none border-b border-transparent focus:border-inkora-teal/40 resize-none leading-tight"
            />
          </div>

          {/* Summary / Excerpt Input */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Excerpt & Thesis Summary (Shown in cards & preview)
            </label>
            <textarea
              rows={2}
              maxLength={350}
              placeholder="A brief 1-2 sentence distillation of your thesis..."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full p-4 rounded-xl bg-slate-100 dark:bg-inkora-surface border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-200 text-sm focus:outline-none focus:border-inkora-teal font-sans resize-none"
            />
            <span className="text-[11px] text-slate-500">{350 - summary.length} chars remaining</span>
          </div>

          {/* Category & Tags Configuration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 rounded-2xl editorial-glass border border-slate-200 dark:border-slate-800">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Editorial Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-100 dark:bg-inkora-navy border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-200 text-xs focus:outline-none focus:border-inkora-teal cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Tags (comma separated)
              </label>
              <input
                type="text"
                placeholder="e.g. Architecture, Systems, Typography"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-100 dark:bg-inkora-navy border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-200 text-xs focus:outline-none focus:border-inkora-teal"
              />
            </div>
          </div>

          {/* Cover Photo Selection */}
          <div className="p-6 rounded-2xl editorial-glass border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center space-x-2">
                <ImageIcon className="w-4 h-4 text-inkora-teal" />
                <span>Cover Photograph</span>
              </label>
              <span className="text-[11px] text-slate-500">Pick a preset or paste image URL</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {coverPresets.map((preset) => (
                <button
                  type="button"
                  key={preset.label}
                  onClick={() => setCoverImage(preset.url)}
                  className={`text-[11px] px-3 py-1.5 rounded-lg border transition-colors ${
                    coverImage === preset.url
                      ? 'border-inkora-teal bg-inkora-teal/10 text-inkora-teal font-semibold'
                      : 'border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-100 dark:bg-inkora-navy border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-200 text-xs focus:outline-none focus:border-inkora-teal font-mono"
            />

            {coverImage && (
              <div className="relative aspect-[21/9] rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                <img
                  src={coverImage}
                  alt="Cover Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          {/* Markdown & Prose Content Editor */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                <FileText className="w-3.5 h-3.5 text-inkora-teal" />
                <span>Story Body (Markdown Supported: ## Heading, &gt; Quote, - List, ``` code)</span>
              </label>
              <div className="flex items-center space-x-4 text-xs text-slate-500 font-mono">
                <span>{wordCount} words</span>
                <span>•</span>
                <span className="flex items-center space-x-1 text-inkora-teal">
                  <Clock className="w-3 h-3" />
                  <span>~{estimatedReadingTime} min read</span>
                </span>
              </div>
            </div>

            <textarea
              rows={18}
              placeholder="Begin writing your thesis, reflections, or technical breakdown..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-6 rounded-2xl bg-slate-100 dark:bg-inkora-surface border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-200 font-serif text-base sm:text-lg leading-relaxed focus:outline-none focus:border-inkora-teal"
            />
          </div>
        </div>
      ) : (
        /* LIVE PREVIEW TAB */
        <div className="p-8 rounded-3xl editorial-glass border border-slate-200 dark:border-slate-800 max-w-3xl mx-auto space-y-8 animate-in fade-in">
          <div>
            <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-inkora-teal px-3 py-1 rounded-full bg-inkora-teal/10 mb-4">
              {category}
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {title || 'Untitled Story'}
            </h1>
            <p className="mt-4 font-sans text-base sm:text-lg text-slate-400">
              {summary || 'Summary preview will appear here...'}
            </p>
          </div>

          {coverImage && (
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-xl">
              <img src={coverImage} alt="Cover Preview" className="w-full h-full object-cover" />
            </div>
          )}

          <div className="prose prose-invert max-w-none text-slate-300 font-serif leading-relaxed text-lg whitespace-pre-wrap">
            {content || 'Begin writing to see the rendered preview...'}
          </div>
        </div>
      )}
    </div>
  );
}

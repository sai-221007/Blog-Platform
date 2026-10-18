const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Bookmark = require('../models/Bookmark');
const User = require('../models/User');
const slugify = require('../utils/slugify');
const calculateReadingTime = require('../utils/readingTime');

// @desc    Get all posts with filtering, search, sorting & pagination
// @route   GET /api/posts
// @access  Public
const getPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 9;
    const skip = (page - 1) * limit;

    const { category, tag, author, search, sort, status } = req.query;

    const query = {};

    // Default to published posts unless author is viewing their drafts
    if (status && ['draft', 'published'].includes(status)) {
      query.status = status;
    } else {
      query.status = 'published';
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (tag) {
      query.tags = { $in: [tag] };
    }

    if (author) {
      query.author = author;
    }

    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { summary: searchRegex },
        { content: searchRegex },
        { tags: searchRegex },
      ];
    }

    // Sorting
    let sortQuery = { publishedAt: -1, createdAt: -1 };
    if (sort === 'oldest') {
      sortQuery = { publishedAt: 1, createdAt: 1 };
    } else if (sort === 'popular') {
      sortQuery = { views: -1, likesCount: -1 };
    } else if (sort === 'mostLiked') {
      sortQuery = { likesCount: -1 };
    }

    const total = await Post.countDocuments(query);
    const posts = await Post.find(query)
      .populate('author', 'name avatar bio role')
      .sort(sortQuery)
      .skip(skip)
      .limit(limit);

    // Get comment counts for these posts
    const postIds = posts.map((p) => p._id);
    const commentCounts = await Comment.aggregate([
      { $match: { post: { $in: postIds } } },
      { $group: { _id: '$post', count: { $sum: 1 } } },
    ]);

    const countMap = {};
    commentCounts.forEach((c) => {
      countMap[c._id.toString()] = c.count;
    });

    const postsWithCounts = posts.map((p) => {
      const pObj = p.toObject();
      pObj.commentCount = countMap[p._id.toString()] || 0;
      return pObj;
    });

    res.status(200).json({
      success: true,
      count: posts.length,
      total,
      totalPages: Math.ceil(total / limit) || 1,
      currentPage: page,
      posts: postsWithCounts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single post by slug or ID
// @route   GET /api/posts/:slugOrId
// @access  Public (Optional Auth)
const getPost = async (req, res, next) => {
  try {
    const { slugOrId } = req.params;

    let post;
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(slugOrId);

    if (isObjectId) {
      post = await Post.findById(slugOrId).populate('author', 'name avatar bio role');
    }

    if (!post) {
      post = await Post.findOne({ slug: slugOrId }).populate('author', 'name avatar bio role');
    }

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Article not found.',
      });
    }

    // Increment view count if published
    if (post.status === 'published') {
      post.views += 1;
      await post.save();
    }

    const postObj = post.toObject();

    // Attach comment count
    const commentCount = await Comment.countDocuments({ post: post._id });
    postObj.commentCount = commentCount;

    // Check if current user liked or bookmarked
    if (req.user) {
      postObj.isLiked = post.likedBy.some(
        (userId) => userId.toString() === req.user._id.toString()
      );
      const isBookmarked = await Bookmark.exists({
        user: req.user._id,
        post: post._id,
      });
      postObj.isBookmarked = !!isBookmarked;
    } else {
      postObj.isLiked = false;
      postObj.isBookmarked = false;
    }

    res.status(200).json({
      success: true,
      post: postObj,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new post
// @route   POST /api/posts
// @access  Private (Author/Admin)
const createPost = async (req, res, next) => {
  try {
    const { title, summary, content, category, tags, coverImage, status } = req.body;

    if (!title || !summary || !content || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, summary, content, and category.',
      });
    }

    // Generate unique slug
    let baseSlug = slugify(title);
    if (!baseSlug) baseSlug = 'editorial-story';
    let slug = baseSlug;
    let counter = 1;
    while (await Post.exists({ slug })) {
      slug = `${baseSlug}-${counter}-${Math.random().toString(36).substring(2, 6)}`;
      counter++;
    }

    const readingTime = calculateReadingTime(content);

    // Parse tags array
    let processedTags = [];
    if (Array.isArray(tags)) {
      processedTags = tags.map((t) => t.trim().toLowerCase()).filter(Boolean);
    } else if (typeof tags === 'string') {
      processedTags = tags
        .split(',')
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);
    }

    const post = await Post.create({
      author: req.user._id,
      title: title.trim(),
      slug,
      summary: summary.trim(),
      content,
      category,
      tags: processedTags,
      coverImage:
        coverImage ||
        'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80',
      status: status || 'published',
      readingTime,
      publishedAt: status === 'draft' ? null : Date.now(),
    });

    const populatedPost = await Post.findById(post._id).populate(
      'author',
      'name avatar bio role'
    );

    res.status(201).json({
      success: true,
      message: 'Article created successfully.',
      post: populatedPost,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private (Owner or Admin)
const updatePost = async (req, res, next) => {
  try {
    const id = req.params.id || req.params.slugOrId;
    let post;
    if (/^[0-9a-fA-F]{24}$/.test(id)) {
      post = await Post.findById(id);
    } else {
      post = await Post.findOne({ slug: id });
    }

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Article not found.',
      });
    }

    // Check ownership
    const isOwner = post.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to edit this article.',
      });
    }

    const { title, summary, content, category, tags, coverImage, status } = req.body;

    if (title && title.trim() !== post.title) {
      post.title = title.trim();
      let baseSlug = slugify(title);
      let newSlug = baseSlug;
      let counter = 1;
      while (await Post.exists({ slug: newSlug, _id: { $ne: post._id } })) {
        newSlug = `${baseSlug}-${counter}`;
        counter++;
      }
      post.slug = newSlug;
    }

    if (summary) post.summary = summary.trim();
    if (content) {
      post.content = content;
      post.readingTime = calculateReadingTime(content);
    }
    if (category) post.category = category;
    if (coverImage) post.coverImage = coverImage;

    if (tags !== undefined) {
      if (Array.isArray(tags)) {
        post.tags = tags.map((t) => t.trim().toLowerCase()).filter(Boolean);
      } else if (typeof tags === 'string') {
        post.tags = tags
          .split(',')
          .map((t) => t.trim().toLowerCase())
          .filter(Boolean);
      }
    }

    if (status) {
      if (post.status === 'draft' && status === 'published' && !post.publishedAt) {
        post.publishedAt = Date.now();
      }
      post.status = status;
    }

    await post.save();

    const populatedPost = await Post.findById(post._id).populate(
      'author',
      'name avatar bio role'
    );

    res.status(200).json({
      success: true,
      message: 'Article updated successfully.',
      post: populatedPost,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private (Owner or Admin)
const deletePost = async (req, res, next) => {
  try {
    const id = req.params.id || req.params.slugOrId;
    let post;
    if (/^[0-9a-fA-F]{24}$/.test(id)) {
      post = await Post.findById(id);
    } else {
      post = await Post.findOne({ slug: id });
    }

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Article not found.',
      });
    }

    // Check ownership
    const isOwner = post.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this article.',
      });
    }

    // Delete associated comments and bookmarks
    await Comment.deleteMany({ post: post._id });
    await Bookmark.deleteMany({ post: post._id });
    await Post.findByIdAndDelete(post._id);

    res.status(200).json({
      success: true,
      message: 'Article deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle like on post
// @route   POST /api/posts/:id/like
// @access  Private
const toggleLikePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Article not found.',
      });
    }

    const userId = req.user._id;
    const index = post.likedBy.findIndex((id) => id.toString() === userId.toString());

    let isLiked = false;
    if (index === -1) {
      post.likedBy.push(userId);
      post.likesCount += 1;
      isLiked = true;
    } else {
      post.likedBy.splice(index, 1);
      post.likesCount = Math.max(0, post.likesCount - 1);
      isLiked = false;
    }

    await post.save();

    res.status(200).json({
      success: true,
      isLiked,
      likesCount: post.likesCount,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle bookmark post
// @route   POST /api/posts/:id/bookmark
// @access  Private
const toggleBookmarkPost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Article not found.',
      });
    }

    const existingBookmark = await Bookmark.findOne({
      user: req.user._id,
      post: post._id,
    });

    let isBookmarked = false;
    if (existingBookmark) {
      await Bookmark.findByIdAndDelete(existingBookmark._id);
      await User.findByIdAndUpdate(req.user._id, {
        $pull: { bookmarks: post._id },
      });
      isBookmarked = false;
    } else {
      await Bookmark.create({
        user: req.user._id,
        post: post._id,
      });
      await User.findByIdAndUpdate(req.user._id, {
        $addToSet: { bookmarks: post._id },
      });
      isBookmarked = true;
    }

    res.status(200).json({
      success: true,
      isBookmarked,
      message: isBookmarked ? 'Article saved to bookmarks.' : 'Article removed from bookmarks.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured editorial article
// @route   GET /api/posts/editorial/featured
// @access  Public
const getFeaturedPost = async (req, res, next) => {
  try {
    const featured = await Post.findOne({ status: 'published' })
      .sort({ views: -1, likesCount: -1, createdAt: -1 })
      .populate('author', 'name avatar bio role');

    if (!featured) {
      return res.status(200).json({
        success: true,
        post: null,
      });
    }

    const commentCount = await Comment.countDocuments({ post: featured._id });
    const postObj = featured.toObject();
    postObj.commentCount = commentCount;

    res.status(200).json({
      success: true,
      post: postObj,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get trending articles
// @route   GET /api/posts/editorial/trending
// @access  Public
const getTrendingPosts = async (req, res, next) => {
  try {
    const trending = await Post.find({ status: 'published' })
      .sort({ views: -1, likesCount: -1 })
      .limit(5)
      .populate('author', 'name avatar bio role');

    res.status(200).json({
      success: true,
      posts: trending,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get related articles
// @route   GET /api/posts/:id/related
// @access  Public
const getRelatedPosts = async (req, res, next) => {
  try {
    const { id } = req.params;
    const currentPost = await Post.findById(id);

    if (!currentPost) {
      return res.status(404).json({
        success: false,
        message: 'Article not found.',
      });
    }

    const related = await Post.find({
      status: 'published',
      _id: { $ne: currentPost._id },
      category: currentPost.category,
    })
      .sort({ createdAt: -1 })
      .limit(3)
      .populate('author', 'name avatar bio role');

    res.status(200).json({
      success: true,
      posts: related,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get platform statistics (real DB aggregated data)
// @route   GET /api/posts/editorial/stats
// @access  Public
const getPlatformStats = async (req, res, next) => {
  try {
    const [publishedPostsCount, totalAuthors, totalComments, viewAggregation] =
      await Promise.all([
        Post.countDocuments({ status: 'published' }),
        User.countDocuments({ role: { $in: ['author', 'admin'] } }),
        Comment.countDocuments(),
        Post.aggregate([
          { $match: { status: 'published' } },
          { $group: { _id: null, totalViews: { $sum: '$views' } } },
        ]),
      ]);

    const totalViews = viewAggregation[0]?.totalViews || 0;

    res.status(200).json({
      success: true,
      stats: {
        totalArticles: publishedPostsCount,
        totalAuthors: totalAuthors || 1,
        totalComments,
        totalViews,
        categoriesCount: 7,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  toggleLikePost,
  toggleBookmarkPost,
  getFeaturedPost,
  getTrendingPosts,
  getRelatedPosts,
  getPlatformStats,
};

const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');

// @desc    Get public user profile
// @route   GET /api/users/:id
// @access  Public
const getUserProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select('name avatar bio role createdAt');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Author profile not found.',
      });
    }

    const publishedCount = await Post.countDocuments({
      author: user._id,
      status: 'published',
    });

    const viewsAgg = await Post.aggregate([
      { $match: { author: user._id, status: 'published' } },
      { $group: { _id: null, totalViews: { $sum: '$views' } } },
    ]);

    const totalViews = viewsAgg[0]?.totalViews || 0;

    res.status(200).json({
      success: true,
      user,
      stats: {
        publishedCount,
        totalViews,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get posts by user
// @route   GET /api/users/:id/posts
// @access  Public (with optionalAuth)
const getUserPosts = async (req, res, next) => {
  try {
    const { id } = req.params;
    const isOwner = req.user && req.user._id.toString() === id;

    const query = { author: id };
    if (!isOwner) {
      query.status = 'published';
    }

    const posts = await Post.find(query)
      .populate('author', 'name avatar bio role')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: posts.length,
      posts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get author dashboard data
// @route   GET /api/users/me/dashboard
// @access  Private
const getUserDashboard = async (req, res, next) => {
  try {
    const authorId = req.user._id;

    // Get all posts by this author
    const posts = await Post.find({ author: authorId })
      .populate('author', 'name avatar bio role')
      .sort({ updatedAt: -1 });

    const publishedPosts = posts.filter((p) => p.status === 'published');
    const draftPosts = posts.filter((p) => p.status === 'draft');

    const totalPublished = publishedPosts.length;
    const totalDrafts = draftPosts.length;
    const totalViews = posts.reduce((sum, p) => sum + (p.views || 0), 0);
    const totalLikes = posts.reduce((sum, p) => sum + (p.likesCount || 0), 0);

    // Get total comments received across all author's posts
    const postIds = posts.map((p) => p._id);
    const totalCommentsReceived = await Comment.countDocuments({
      post: { $in: postIds },
    });

    // Attach comment counts to each post
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
      stats: {
        totalPublished,
        totalDrafts,
        totalViews,
        totalLikes,
        totalCommentsReceived,
      },
      posts: postsWithCounts,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserProfile,
  getUserPosts,
  getUserDashboard,
};

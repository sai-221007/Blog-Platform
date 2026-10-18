const express = require('express');
const {
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
} = require('../controllers/postController');
const {
  getPostComments,
  createComment,
} = require('../controllers/commentController');
const { protect, optionalAuth } = require('../middleware/authMiddleware');

const router = express.Router();

// Platform stats and curated lists (before :slugOrId to avoid matching)
router.get('/editorial/stats', getPlatformStats);
router.get('/editorial/featured', getFeaturedPost);
router.get('/editorial/trending', getTrendingPosts);

// Core post routes
router.route('/')
  .get(getPosts)
  .post(protect, createPost);

router.route('/:slugOrId')
  .get(optionalAuth, getPost)
  .put(protect, updatePost)
  .delete(protect, deletePost);

// Social interactions
router.post('/:id/like', protect, toggleLikePost);
router.post('/:id/bookmark', protect, toggleBookmarkPost);
router.get('/:id/related', getRelatedPosts);

// Nested comment routes on post
router.route('/:postId/comments')
  .get(getPostComments)
  .post(protect, createComment);

module.exports = router;

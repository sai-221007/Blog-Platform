const express = require('express');
const {
  getUserProfile,
  getUserPosts,
  getUserDashboard,
} = require('../controllers/userController');
const { protect, optionalAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/me/dashboard', protect, getUserDashboard);
router.get('/:id', getUserProfile);
router.get('/:id/posts', optionalAuth, getUserPosts);

module.exports = router;

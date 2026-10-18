const Newsletter = require('../models/Newsletter');

// @desc    Subscribe to editorial newsletter
// @route   POST /api/newsletter/subscribe
// @access  Public
const subscribe = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email || !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.',
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const existing = await Newsletter.findOne({ email: cleanEmail });

    if (existing) {
      return res.status(200).json({
        success: true,
        message: 'You are already subscribed to the INKORA editorial dispatch.',
      });
    }

    await Newsletter.create({ email: cleanEmail });

    res.status(201).json({
      success: true,
      message: 'Thank you for subscribing to INKORA. Ideas leave a mark.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { subscribe };

const mongoose = require('mongoose');
const slugify = require('../utils/slugify');
const calculateReadingTime = require('../utils/readingTime');

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Post author is required'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide an article title'],
      trim: true,
      maxlength: [180, 'Title cannot exceed 180 characters'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    summary: {
      type: String,
      required: [true, 'Please provide an article summary / excerpt'],
      trim: true,
      maxlength: [350, 'Summary cannot exceed 350 characters'],
    },
    content: {
      type: String,
      required: [true, 'Article content cannot be empty'],
    },
    coverImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80',
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: [
        'Technology',
        'Design',
        'Programming',
        'Science',
        'Creativity',
        'Lifestyle',
        'Business',
      ],
      index: true,
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'published',
      index: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    likesCount: {
      type: Number,
      default: 0,
    },
    likedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    readingTime: {
      type: Number,
      default: 1,
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for comment count
postSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'post',
  count: true,
});

// Calculate reading time before saving
postSchema.pre('validate', function (next) {
  if (this.content) {
    this.readingTime = calculateReadingTime(this.content);
  }
  if (!this.slug && this.title) {
    this.slug = slugify(this.title) + '-' + Math.random().toString(36).substring(2, 7);
  }
  next();
});

// Compound indexes for search and filtering
postSchema.index({ title: 'text', summary: 'text', content: 'text' });
postSchema.index({ status: 1, createdAt: -1 });
postSchema.index({ category: 1, status: 1 });

module.exports = mongoose.model('Post', postSchema);

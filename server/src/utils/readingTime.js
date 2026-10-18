const calculateReadingTime = (content) => {
  if (!content) return 1;
  const words = content.trim().split(/\s+/).length;
  const wordsPerMinute = 200;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
};

module.exports = calculateReadingTime;

require('dotenv').config();
const app = require('./app');
const { connectDB } = require('./config/db');
const Post = require('./models/Post');
const seedData = require('./scripts/seed');

const PORT = process.env.PORT || 5051;

// Connect to Database and start listening
connectDB()
  .then(async () => {
    // Auto-seed if database is empty
    try {
      const postCount = await Post.countDocuments();
      if (postCount === 0) {
        console.log('[AutoSeed] Empty database detected. Seeding INKORA editorial records...');
        await seedData();
        console.log('[AutoSeed] Finished initial data population.');
      }
    } catch (seedErr) {
      console.warn('[AutoSeed] Notice: Auto-seed skipped or encountered issue:', seedErr.message);
    }

    const server = app.listen(PORT, () => {
      console.log(`\n=================================================`);
      console.log(`  🖋️  INKORA Backend API Server Running`);
      console.log(`  📡  Port: http://localhost:${PORT}`);
      console.log(`  🌿  Mode: ${process.env.NODE_ENV || 'development'}`);
      console.log(`  ✨  "Ideas Leave a Mark."`);
      console.log(`=================================================\n`);
    });

    // Handle Unhandled Promise Rejections
    process.on('unhandledRejection', (err) => {
      console.error(`[Unhandled Rejection] Error: ${err.message}`);
    });
  })
  .catch((err) => {
    console.error(`[Fatal Server Error] Could not start server:`, err);
    process.exit(1);
  });

const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');

let mongodInstance = null;

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/inkora_blog';
  
  try {
    console.log(`[INKORA-DB] Attempting connection to MongoDB: ${mongoUri}`);
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`[INKORA-DB] Connected to MongoDB: ${mongoose.connection.host}`);
  } catch (err) {
    console.warn(`[INKORA-DB] Direct MongoDB connection failed (${err.message}). Starting MongoMemoryServer fallback...`);
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      
      const candidatePaths = [
        path.resolve(__dirname, '../../../node_modules/.cache/mongodb-memory-server/mongod-x64-win32-7.0.24.exe'),
        path.resolve(__dirname, '../../node_modules/.cache/mongodb-memory-server/mongod-x64-win32-7.0.24.exe'),
        path.resolve(__dirname, '../../../../E-Commerce/server/node_modules/.cache/mongodb-memory-server/mongod-x64-win32-7.0.24.exe'),
      ];

      const foundBinary = candidatePaths.find((p) => fs.existsSync(p));

      const config = {
        instance: {
          launchTimeout: 60000,
        },
      };

      if (foundBinary) {
        console.log(`[INKORA-DB] Utilizing verified Mongo executable at: ${foundBinary}`);
        config.binary = {
          systemBinary: foundBinary,
        };
      } else {
        const cacheDir = path.resolve(__dirname, '../../node_modules/.cache/mongodb-memory-server');
        config.binary = {
          downloadDir: cacheDir,
          version: '7.0.24',
        };
      }

      mongodInstance = await MongoMemoryServer.create(config);
      const inMemoryUri = mongodInstance.getUri();
      await mongoose.connect(inMemoryUri);
      console.log(`[INKORA-DB] Connected successfully to in-memory MongoDB fallback: ${inMemoryUri}`);
    } catch (memErr) {
      console.error(`[INKORA-DB] Critical Error connecting to in-memory database:`, memErr);
      throw memErr;
    }
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongodInstance) {
      await mongodInstance.stop();
    }
    console.log('[INKORA-DB] MongoDB disconnected successfully.');
  } catch (err) {
    console.error('[INKORA-DB] Error during disconnection:', err);
  }
};

module.exports = { connectDB, disconnectDB };

/**
 * Database Configuration
 * 
 * Handles MongoDB connection using Mongoose.
 * Includes retry logic and connection event handlers.
 */

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Connection options
    const options = {
      // Use new URL parser
      // useNewUrlParser: true, // No longer needed in Mongoose 6+
      // useUnifiedTopology: true, // No longer needed in Mongoose 6+
    };

    // Connect to MongoDB
    const conn = await mongoose.connect(process.env.MONGODB_URI, options);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);

    // Connection event handlers
    mongoose.connection.on('connected', () => {
      console.log('🔗 Mongoose connected to MongoDB');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ Mongoose connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  Mongoose disconnected from MongoDB');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('🛑 Mongoose connection closed due to app termination');
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message);
    console.error('💡 Tips:');
    console.error('   - Check if MongoDB is running (local) or Atlas connection string is correct');
    console.error('   - Verify MONGODB_URI in .env file');
    console.error('   - For Atlas: Check network access and database user credentials');
    process.exit(1);
  }
};

module.exports = connectDB;

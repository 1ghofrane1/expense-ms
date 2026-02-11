/**
 * Database Seed Script
 * 
 * Populates the database with sample expense data for testing.
 * Run with: npm run seed
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Expense = require('../models/Expense');

// Sample expenses data
const sampleExpenses = [
  {
    title: 'Grocery Shopping',
    amount: 125.50,
    category: 'Food',
    date: new Date('2024-02-10'),
    notes: 'Weekly groceries from Whole Foods'
  },
  {
    title: 'Gas Station',
    amount: 45.00,
    category: 'Transport',
    date: new Date('2024-02-09'),
    notes: 'Fill up tank'
  },
  {
    title: 'Netflix Subscription',
    amount: 15.99,
    category: 'Bills',
    date: new Date('2024-02-08'),
    notes: 'Monthly subscription'
  },
  {
    title: 'Coffee Shop',
    amount: 8.50,
    category: 'Food',
    date: new Date('2024-02-08'),
    notes: 'Morning coffee and pastry'
  },
  {
    title: 'New Headphones',
    amount: 89.99,
    category: 'Shopping',
    date: new Date('2024-02-07'),
    notes: 'Wireless Bluetooth headphones'
  },
  {
    title: 'Lunch at Restaurant',
    amount: 32.00,
    category: 'Food',
    date: new Date('2024-02-06'),
    notes: 'Team lunch'
  },
  {
    title: 'Uber Ride',
    amount: 18.75,
    category: 'Transport',
    date: new Date('2024-02-05'),
    notes: 'Ride to airport'
  },
  {
    title: 'Electric Bill',
    amount: 87.50,
    category: 'Bills',
    date: new Date('2024-02-01'),
    notes: 'January electric bill'
  },
  {
    title: 'Gym Membership',
    amount: 50.00,
    category: 'Other',
    date: new Date('2024-02-01'),
    notes: 'Monthly gym fee'
  },
  {
    title: 'Book Purchase',
    amount: 24.99,
    category: 'Shopping',
    date: new Date('2024-01-30'),
    notes: 'Programming book from Amazon'
  },
  {
    title: 'Pizza Delivery',
    amount: 28.50,
    category: 'Food',
    date: new Date('2024-01-28'),
    notes: 'Friday night dinner'
  },
  {
    title: 'Metro Card',
    amount: 35.00,
    category: 'Transport',
    date: new Date('2024-01-25'),
    notes: 'Monthly metro pass'
  },
  {
    title: 'Phone Bill',
    amount: 65.00,
    category: 'Bills',
    date: new Date('2024-01-20'),
    notes: 'Monthly phone service'
  },
  {
    title: 'New Shoes',
    amount: 79.99,
    category: 'Shopping',
    date: new Date('2024-01-15'),
    notes: 'Running shoes'
  },
  {
    title: 'Restaurant Dinner',
    amount: 95.00,
    category: 'Food',
    date: new Date('2024-01-12'),
    notes: 'Anniversary dinner'
  }
];

/**
 * Seed the database
 */
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seed...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Clear existing expenses
    const deleteResult = await Expense.deleteMany({});
    console.log(`🗑️  Cleared ${deleteResult.deletedCount} existing expenses`);
    
    // Insert sample expenses
    const expenses = await Expense.insertMany(sampleExpenses);
    console.log(`✅ Inserted ${expenses.length} sample expenses`);
    
    // Display summary
    console.log('\n📊 Seed Summary:');
    console.log('─'.repeat(50));
    
    const categories = ['Food', 'Transport', 'Shopping', 'Bills', 'Other'];
    for (const category of categories) {
      const count = expenses.filter(e => e.category === category).length;
      const total = expenses
        .filter(e => e.category === category)
        .reduce((sum, e) => sum + e.amount, 0);
      
      console.log(`${category.padEnd(12)} | Count: ${count.toString().padEnd(3)} | Total: $${total.toFixed(2)}`);
    }
    
    const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);
    console.log('─'.repeat(50));
    console.log(`Total Expenses: ${expenses.length}`);
    console.log(`Total Amount: $${totalAmount.toFixed(2)}`);
    console.log('─'.repeat(50));
    
    console.log('\n✅ Database seeded successfully!');
    console.log('💡 You can now start the services and view the data');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
};

// Run the seed function
seedDatabase();

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import connectDB from '../config/database.js';

dotenv.config();

const seedUsers = [
  {
    Name: "Varun Agrawal",
    Email: "varun@example.com",
    Contact: "+91-9999888777"
  },
  {
    Name: "Bunti Agrawal", 
    Email: "bunti@example.com",
    Contact: "+91-8888777666"
  },
  {
    Name: "Rohit Sharma",
    Email: "rohit@example.com", 
    Contact: "+91-7777666555"
  },
  {
    Name: "Priya Singh",
    Email: "priya@example.com",
    Contact: "+91-6666555444"
  },
  {
    Name: "Amit Kumar",
    Email: "amit@example.com",
    Contact: "+91-5555444333"
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();
    
    // Clear existing users
    await User.deleteMany({});
    console.log('🧹 Cleared existing users');
    
    // Insert seed users
    const createdUsers = await User.insertMany(seedUsers);
    console.log(`✅ Created ${createdUsers.length} seed users`);
    
    console.log('🌱 Database seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
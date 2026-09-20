// server/config/seedData.js
// Run: node config/seedData.js
// Seeds a demo user and 10 sample job applications

const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/job-applicant-tracker';

const STAGES = ['Saved', 'Applied', 'OA', 'Phone Screen', 'Interview', 'Offer', 'Rejected'];
const SOURCES = ['LinkedIn', 'Naukri', 'Company Site', 'Referral', 'Internshala'];

const sampleApps = [
  { company: 'Google', role: 'Software Engineer Intern', location: 'Bangalore, India', stage: 'Interview', source: 'LinkedIn', priority: true, salaryNote: '₹80,000/month' },
  { company: 'Microsoft', role: 'SDE Intern', location: 'Hyderabad, India', stage: 'Applied', source: 'Company Site', priority: true, salaryNote: '₹70,000/month' },
  { company: 'Amazon', role: 'SDE-1', location: 'Bengaluru, India', stage: 'OA', source: 'LinkedIn', priority: false },
  { company: 'Flipkart', role: 'Frontend Developer', location: 'Bangalore, India', stage: 'Phone Screen', source: 'Referral', priority: true },
  { company: 'Swiggy', role: 'Full Stack Developer', location: 'Bangalore, India', stage: 'Offer', source: 'LinkedIn', salaryNote: '₹18 LPA', priority: true },
  { company: 'Razorpay', role: 'Backend Engineer', location: 'Remote', stage: 'Rejected', source: 'Naukri' },
  { company: 'Zomato', role: 'React Developer', location: 'Gurugram, India', stage: 'Applied', source: 'LinkedIn' },
  { company: 'CRED', role: 'Software Engineer', location: 'Bangalore, India', stage: 'Saved', source: 'LinkedIn', priority: false },
  { company: 'PhonePe', role: 'Node.js Developer', location: 'Bangalore, India', stage: 'Applied', source: 'Company Site' },
  { company: 'Groww', role: 'MERN Stack Developer', location: 'Remote', stage: 'Interview', source: 'Referral', priority: true, salaryNote: '₹20 LPA' },
];

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  // Import models after connection
  const User = require('../models/User');
  const JobApplication = require('../models/JobApplication');

  // Clean up existing demo data
  await User.deleteOne({ email: 'demo@jobtrack.dev' });

  // Create demo user (plain password — User model pre-save hook hashes it)
  const user = await User.create({
    name: 'Demo User',
    email: 'demo@jobtrack.dev',
    password: 'demo1234',
  });
  console.log(`✅ Demo user created: demo@jobtrack.dev / demo1234`);

  // Delete existing apps for demo user
  await JobApplication.deleteMany({ user: user._id });

  // Create sample applications
  const appsWithUser = sampleApps.map((app, i) => ({
    ...app,
    user: user._id,
    appliedDate: i < 7 ? new Date(Date.now() - i * 3 * 24 * 60 * 60 * 1000) : null,
    notes: `Notes for ${app.company}: Prepare DSA + System Design`,
    tags: ['mern', 'react', i % 2 === 0 ? 'remote' : 'on-site'],
  }));

  await JobApplication.insertMany(appsWithUser);
  console.log(`✅ ${appsWithUser.length} sample applications inserted`);

  mongoose.disconnect();
  console.log('✅ Seed complete! Login with demo@jobtrack.dev / demo1234');
}

seed().catch((err) => { console.error(err); process.exit(1); });
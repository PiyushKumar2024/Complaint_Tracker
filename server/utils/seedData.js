const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Department = require('../models/Department');
const User = require('../models/User');

dotenv.config({ path: path.join(__dirname, '../.env') });

const departments = [
  {
    name: 'Public Works',
    code: 'PWD',
    categories: ['Roads', 'Bridges', 'Buildings', 'Potholes', 'Footpaths'],
    contactEmail: 'pwd@city.gov'
  },
  {
    name: 'Water Supply & Sewage',
    code: 'WS',
    categories: ['Water Leakage', 'No Water Supply', 'Contaminated Water', 'Drainage Overflow', 'Sewage Blockage'],
    contactEmail: 'water@city.gov'
  },
  {
    name: 'Electricity Board',
    code: 'EB',
    categories: ['Power Outage', 'Street Lights', 'Fallen Wire', 'Faulty Meter', 'Voltage Fluctuation'],
    contactEmail: 'electricity@city.gov'
  },
  {
    name: 'Health & Sanitation',
    code: 'HD',
    categories: ['Garbage Accumulation', 'Dead Animals', 'Mosquito Breeding', 'Public Toilet Hygiene', 'Hospital Complaints'],
    contactEmail: 'health@city.gov'
  },
  {
    name: 'Transport & Traffic',
    code: 'TR',
    categories: ['Broken Traffic Signal', 'Public Bus Delay', 'Illegal Parking', 'Auto/Taxi Overcharging'],
    contactEmail: 'transport@city.gov'
  },
  {
    name: 'Municipal Corporation',
    code: 'MC',
    categories: ['Encroachment', 'Illegal Construction', 'Park Maintenance', 'Stray Cattle/Dogs'],
    contactEmail: 'municipal@city.gov'
  }
];

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/complaint_tracker';
    await mongoose.connect(mongoUri);

    await Department.deleteMany({});
    await Department.insertMany(departments);

    const adminEmail = 'admin@tracker.com';
    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      await User.create({
        name: 'System Administrator',
        email: adminEmail,
        password: 'admin123',
        role: 'admin',
        department: 'Administration'
      });
    }

    const staffEmail = 'pwd.staff@tracker.com';
    let staff = await User.findOne({ email: staffEmail });
    if (!staff) {
      await User.create({
        name: 'PWD Field Officer',
        email: staffEmail,
        password: 'staff123',
        role: 'staff',
        department: 'Public Works'
      });
    }

    const studentEmail = 'citizen@tracker.com';
    let citizen = await User.findOne({ email: studentEmail });
    if (!citizen) {
      await User.create({
        name: 'Rahul Sharma',
        email: studentEmail,
        password: 'user123',
        role: 'student',
        department: 'General'
      });
    }

    console.log('Database seeded successfully.');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error.message);
    process.exit(1);
  }
};

seedDatabase();

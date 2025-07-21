import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/userModel'
import fs from 'fs';

dotenv.config();

async function exportUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log('✅ MongoDB connecté');

    const users = await User.find().lean();
    fs.writeFileSync('users-export.json', JSON.stringify(users, null, 2));

    console.log(`✅ Exporté ${users.length} utilisateurs vers users-export.json`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Erreur export:', err);
    process.exit(1);
  }
}

exportUsers();

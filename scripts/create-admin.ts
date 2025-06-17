import { db } from '../server/db.js';
import { users } from '../shared/schema.js';
import bcrypt from 'bcrypt';

async function createAdminUser() {
  try {
    const username = 'admin';
    const password = 'swimai2025';
    const email = 'admin@swimai.com';
    
    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Create the admin user
    const [user] = await db.insert(users).values({
      username,
      email,
      passwordHash,
      role: 'admin'
    }).returning();
    
    console.log('✅ Admin user created successfully!');
    console.log('Username:', username);
    console.log('Password:', password);
    console.log('Email:', email);
    console.log('');
    console.log('You can now log in to the CMS at /cms/login');
    
  } catch (error) {
    if (error.message?.includes('duplicate key')) {
      console.log('✅ Admin user already exists');
      console.log('Username: admin');
      console.log('Password: swimai2025');
    } else {
      console.error('❌ Error creating admin user:', error.message);
    }
  }
  
  process.exit(0);
}

createAdminUser();
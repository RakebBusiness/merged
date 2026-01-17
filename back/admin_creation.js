#!/usr/bin/env node

/**
 * Admin Creation Script for AlgoMaster
 * 
 * This script creates a new admin user in the database.
 * It prompts for email and password, then creates the user.
 * 
 * Usage: node create-admin.js
 */

const readline = require('readline');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

// Database configuration - Update with your credentials
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'algomastervf',
  password: '123456789',
  port: 5432,
});

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Helper function to ask questions
function question(query) {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

// Helper function to ask for password (hidden input)
function questionSecret(query) {
  return new Promise((resolve) => {
    const readline = require('readline');
    const stdin = process.stdin;
    
    process.stdout.write(query);
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf8');
    
    let password = '';
    stdin.on('data', function(ch) {
      ch = ch.toString('utf8');
      
      switch (ch) {
        case '\n':
        case '\r':
        case '\u0004':
          stdin.setRawMode(false);
          stdin.pause();
          process.stdout.write('\n');
          resolve(password);
          break;
        case '\u0003':
          process.exit();
          break;
        case '\u007f': // Backspace
          password = password.slice(0, -1);
          process.stdout.clearLine();
          process.stdout.cursorTo(0);
          process.stdout.write(query + '*'.repeat(password.length));
          break;
        default:
          password += ch;
          process.stdout.write('*');
          break;
      }
    });
  });
}

async function createAdmin() {
  const client = await pool.connect();
  
  try {
    console.log('\n=== AlgoMaster Admin Creation ===\n');
    
    // Get admin details
    const nom = await question('Enter first name (Nom): ');
    const prenom = await question('Enter last name (Prenom): ');
    const email = await question('Enter email: ');
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error('\n❌ Invalid email format!');
      process.exit(1);
    }
    
    const password = await questionSecret('Enter password (hidden): ');
    const confirmPassword = await questionSecret('Confirm password: ');
    
    // Validate password
    if (password.length < 8) {
      console.error('\n❌ Password must be at least 8 characters long!');
      process.exit(1);
    }
    
    if (password !== confirmPassword) {
      console.error('\n❌ Passwords do not match!');
      process.exit(1);
    }
    
    console.log('\n\nCreating admin user...');
    
    // Start transaction
    await client.query('BEGIN');
    
    // Check if email already exists
    const emailCheck = await client.query(
      'SELECT "idUser" FROM "USER" WHERE "Email" = $1',
      [email]
    );
    
    if (emailCheck.rows.length > 0) {
      console.error('\n❌ Email already exists in the database!');
      await client.query('ROLLBACK');
      process.exit(1);
    }
    
    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Insert into USER table
    const userResult = await client.query(
      `INSERT INTO "USER" ("Nom", "Prenom", "Email", "motDePasse") 
       VALUES ($1, $2, $3, $4) 
       RETURNING "idUser"`,
      [nom, prenom, email, hashedPassword]
    );
    
    const userId = userResult.rows[0].idUser;
    
    // Insert into ADMIN table
    await client.query(
      `INSERT INTO "ADMIN" ("idUser", "role") 
       VALUES ($1, 'admin')`,
      [userId]
    );
    
    // Commit transaction
    await client.query('COMMIT');
    
    console.log('\n✅ Admin user created successfully!');
    console.log('\nAdmin Details:');
    console.log(`  ID: ${userId}`);
    console.log(`  Name: ${prenom} ${nom}`);
    console.log(`  Email: ${email}`);
    console.log(`  Role: admin`);
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('\n❌ Error creating admin:', error.message);
    process.exit(1);
  } finally {
    client.release();
    rl.close();
    await pool.end();
  }
}

// Run the script
createAdmin().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
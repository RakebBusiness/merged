const pool = require('./config/database');
const fs = require('fs');
const path = require('path');

async function runMigration() {
    try {
        const migrationSQL = fs.readFileSync(
            path.join(__dirname, 'migrations', 'allow_teachers_to_enroll.sql'),
            'utf8'
        );

        await pool.query(migrationSQL);
        console.log('Migration completed successfully! Teachers can now enroll in courses.');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}

runMigration();

const pool = require('./config/database');
const fs = require('fs');
const path = require('path');

async function runMigration() {
    try {
        console.log('Running migration to fix section and topic IDs...');

        const migrationSQL = fs.readFileSync(
            path.join(__dirname, 'migrations', 'fix_section_topic_ids.sql'),
            'utf8'
        );

        await pool.query(migrationSQL);

        console.log('Migration completed successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}

runMigration();

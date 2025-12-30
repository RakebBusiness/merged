const fs = require('fs');
const path = require('path');
const pool = require('./config/database');

async function runMigration() {
    const client = await pool.connect();
    try {
        console.log('Starting migration: Make Course ID Auto-Increment');

        const migrationPath = path.join(__dirname, 'migrations', 'make_cours_id_serial.sql');
        const migrationSQL = fs.readFileSync(migrationPath, 'utf-8');

        await client.query('BEGIN');
        await client.query(migrationSQL);
        await client.query('COMMIT');

        console.log('Migration completed successfully!');
        console.log('Course IDs will now be auto-generated.');
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Migration failed:', err);
        throw err;
    } finally {
        client.release();
        await pool.end();
    }
}

runMigration()
    .then(() => {
        console.log('Done!');
        process.exit(0);
    })
    .catch((err) => {
        console.error('Error:', err);
        process.exit(1);
    });

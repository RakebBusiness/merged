const pool = require('./config/database');

async function testConnection() {
    try {
        console.log('Testing database connection...');
        const result = await pool.query('SELECT NOW()');
        console.log('Database connection successful!');
        console.log('Current timestamp:', result.rows[0].now);

        const tables = await pool.query(`
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public'
        `);

        console.log('\nTables in database:');
        tables.rows.forEach(row => console.log(`- ${row.table_name}`));

        await pool.end();
        console.log('\nConnection closed.');
    } catch (err) {
        console.error('Database connection error:', err.message);
        process.exit(1);
    }
}

testConnection();

const { drizzle } = require('drizzle-orm/node-postgres');
const { Pool } = require('pg');
const { sql } = require('drizzle-orm');

// Database configuration
const pool = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'postgres',
    database: 'hack4bengal',
});

const db = drizzle(pool);

async function testConnection() {
    try {
        console.log('🔌 Testing database connection...');

        // Test basic connection
        const result = await db.execute(sql`SELECT 1 as test`);
        console.log('✅ Database connection successful:', result.rows[0]);

        // Test if workers table exists
        const tables = await db.execute(sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'workers'
    `);

        if (tables.rows.length > 0) {
            console.log('✅ Workers table exists');

            // Check column names
            const columns = await db.execute(sql`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'workers' 
        ORDER BY column_name
      `);

            console.log('📋 Workers table columns:');
            columns.rows.forEach(col => {
                console.log(`   - ${col.column_name}: ${col.data_type}`);
            });

            // Test a simple query
            const workers = await db.execute(sql`
        SELECT id, "firstName", "lastName" 
        FROM workers 
        LIMIT 1
      `);

            console.log('✅ Simple query successful');
            if (workers.rows.length > 0) {
                console.log('Sample worker:', workers.rows[0]);
            }

        } else {
            console.log('❌ Workers table does not exist');
        }

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        if (error.code === 'ECONNREFUSED') {
            console.log('💡 Make sure PostgreSQL is running on localhost:5432');
        }
    } finally {
        await pool.end();
    }
}

testConnection(); 
const { drizzle } = require('drizzle-orm/node-postgres');
const { Pool } = require('pg');
const { sql } = require('drizzle-orm');

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://username:password@localhost:5432/database_name'
});

const db = drizzle(pool);

async function testDatabaseSchema() {
  try {
    console.log('🧪 Testing database schema...');

    // Test 1: Check if tables exist
    console.log('\n📋 Checking table existence...');
    const tables = await db.execute(sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('workers', 'live_locations', 'specializations')
      ORDER BY table_name
    `);

    console.log('✅ Tables found:', tables.rows.map(row => row.table_name));

    // Test 2: Check column names for live_locations table
    console.log('\n📋 Checking live_locations columns...');
    const liveLocationsColumns = await db.execute(sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'live_locations' 
      ORDER BY column_name
    `);

    console.log('✅ live_locations columns:');
    liveLocationsColumns.rows.forEach(col => {
      console.log(`   - ${col.column_name}: ${col.data_type}`);
    });

    // Test 3: Check column names for specializations table
    console.log('\n📋 Checking specializations columns...');
    const specializationsColumns = await db.execute(sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'specializations' 
      ORDER BY column_name
    `);

    console.log('✅ specializations columns:');
    specializationsColumns.rows.forEach(col => {
      console.log(`   - ${col.column_name}: ${col.data_type}`);
    });

    // Test 3.5: Check column names for workers table
    console.log('\n📋 Checking workers columns...');
    const workersColumns = await db.execute(sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'workers' 
      ORDER BY column_name
    `);

    console.log('✅ workers columns:');
    workersColumns.rows.forEach(col => {
      console.log(`   - ${col.column_name}: ${col.data_type}`);
    });

    // Test 4: Check if there are any workers with locations
    console.log('\n📋 Checking workers with locations...');
    const workersWithLocations = await db.execute(sql`
      SELECT COUNT(*) as count
      FROM workers w
      INNER JOIN live_locations ll ON w.id = ll.worker_id
    `);

    console.log(`✅ Workers with locations: ${workersWithLocations.rows[0].count}`);

    // Test 5: Test the actual query
    console.log('\n📋 Testing worker search query...');
    const testQuery = await db.execute(sql`
      SELECT DISTINCT 
        w.id as worker_id,
        w."firstName",
        w."lastName",
        w.phone_number,
        w.experience_years,
        ll.lat,
        ll.lng,
        (
          6371 * acos(
            cos(radians(22.5726)) *
            cos(radians(ll.lat)) *
            cos(radians(ll.lng) - radians(88.3639)) +
            sin(radians(22.5726)) * sin(radians(ll.lat))
          )
        ) as distance
      FROM workers w
      INNER JOIN live_locations ll ON w.id = ll.worker_id
      WHERE (
        6371 * acos(
          cos(radians(22.5726)) *
          cos(radians(ll.lat)) *
          cos(radians(ll.lng) - radians(88.3639)) +
          sin(radians(22.5726)) * sin(radians(ll.lat))
        )
      ) < 10
      LIMIT 5
    `);

    console.log(`✅ Query successful! Found ${testQuery.rows.length} workers`);
    if (testQuery.rows.length > 0) {
      console.log('Sample worker:', testQuery.rows[0]);
    }

    // Test 6: Test with specializations
    console.log('\n📋 Testing query with specializations...');
    const testQueryWithSpec = await db.execute(sql`
      SELECT DISTINCT 
        w.id as worker_id,
        w."firstName",
        w."lastName",
        s.name as specialization
      FROM workers w
      INNER JOIN live_locations ll ON w.id = ll.worker_id
      INNER JOIN specializations s ON w.id = s.worker_id
      WHERE (
        6371 * acos(
          cos(radians(22.5726)) *
          cos(radians(ll.lat)) *
          cos(radians(ll.lng) - radians(88.3639)) +
          sin(radians(22.5726)) * sin(radians(ll.lat))
        )
      ) < 10
      AND (s.name ILIKE '%plumber%' OR s.sub_category ILIKE '%plumber%')
      LIMIT 5
    `);

    console.log(`✅ Query with specializations successful! Found ${testQueryWithSpec.rows.length} workers`);
    if (testQueryWithSpec.rows.length > 0) {
      console.log('Sample worker with specialization:', testQueryWithSpec.rows[0]);
    }

    console.log('\n🎉 Database schema test completed successfully!');

  } catch (error) {
    console.error('❌ Database schema test failed:', error);
    console.error('Error details:', error.message);
  } finally {
    await pool.end();
  }
}

testDatabaseSchema(); 
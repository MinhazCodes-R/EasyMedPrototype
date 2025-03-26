const { Pool } = require('pg')

const pool = new Pool({
  user: 'admin',
  host: 'localhost',
  database: 'medical_records',
  password: 'admin123',
  port: 5432,
})

async function testConnection() {
  try {
    const res = await pool.query('SELECT NOW()')
    console.log('✅ Connected to PostgreSQL at:', res.rows[0].now)
  } catch (err) {
    console.error('❌ Connection failed:', err)
  } finally {
    await pool.end()
  }
}

testConnection()

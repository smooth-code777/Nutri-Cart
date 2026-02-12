const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Initialize tables
const initDb = async () => {
  try {
    const client = await pool.connect();
    try {
      await client.query(`
                CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                diet_preference TEXT,
                health_conditions TEXT,
                role TEXT DEFAULT 'user'
                );
            `);

      await client.query(`
                CREATE TABLE IF NOT EXISTS products (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                image_url TEXT,
                description TEXT,
                price REAL NOT NULL,
                stock INTEGER DEFAULT 0,
                is_vegetarian INTEGER DEFAULT 1,
                calories INTEGER,
                protein REAL,
                sugar REAL,
                warnings TEXT
                );
            `);

      await client.query(`
                CREATE TABLE IF NOT EXISTS orders (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id),
                items TEXT NOT NULL,
                total_amount REAL NOT NULL,
                status TEXT DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            `);

      console.log('Database initialized');

      // Create default admin if not exists
      const res = await client.query("SELECT * FROM users WHERE role = 'admin'");
      if (res.rows.length === 0) {
        const bcrypt = require('bcryptjs');
        const hashedPassword = bcrypt.hashSync('admin123', 10);
        await client.query(`
                    INSERT INTO users (username, password, role) 
                    VALUES ($1, $2, $3)
                `, ['admin', hashedPassword, 'admin']);
        console.log('Default admin created: admin / admin123');
      }

    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Error initializing database', err);
  }
};

// Only run initDb if not in production environment or if explicitly called
// For Vercel, we might want to run this manually or check env
if (process.env.NODE_ENV !== 'production') {
  initDb();
}

module.exports = {
  query: (text, params) => pool.query(text, params),
};

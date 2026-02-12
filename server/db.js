const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new Database(dbPath);

// Initialize tables
const initDb = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      diet_preference TEXT,
      health_conditions TEXT,
      role TEXT DEFAULT 'user'
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      image_url TEXT,
      description TEXT,
      price REAL NOT NULL,
      stock INTEGER DEFAULT 0,
      is_vegetarian INTEGER DEFAULT 1, -- 0 for false, 1 for true
      calories INTEGER,
      protein REAL,
      sugar REAL,
      warnings TEXT
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      items TEXT NOT NULL, -- JSON string
      total_amount REAL NOT NULL,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    );
  `);

  console.log('Database initialized');

  // Create default admin if not exists
  const adminExists = db.prepare("SELECT * FROM users WHERE role = 'admin'").get();
  if (!adminExists) {
    const hashedPassword = bcrypt.hashSync('admin123', 10);
    db.prepare(`
          INSERT INTO users (username, password, role) 
          VALUES (?, ?, ?)
      `).run('admin', hashedPassword, 'admin');
    console.log('Default admin created: admin / admin123');
  }
};

initDb();

module.exports = db;

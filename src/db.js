const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database.sqlite');
const db = new sqlite3.Database(dbPath);

// Initialize schema
db.serialize(() => {
  db.run('PRAGMA foreign_keys = ON');
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    age INTEGER NOT NULL CHECK(age >= 0)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  )`);

  db.run(`CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id)`);

  // Seed initial users if empty
  db.get('SELECT COUNT(*) AS count FROM users', (err, row) => {
    if (err) return; // silently skip on error
    if (row && row.count === 0) {
      const users = [
        ['Alice', 'alice@example.com', 25],
        ['Bob', 'bob@example.com', 30],
        ['Carol', 'carol@example.com', 28],
      ];
      const stmt = db.prepare('INSERT INTO users (name, email, age) VALUES (?, ?, ?)');
      for (const u of users) stmt.run(...u);
      stmt.finalize();
    }
  });

  // Seed initial posts if empty (uses existing users)
  db.get('SELECT COUNT(*) AS count FROM posts', (err, row) => {
    if (err) return; // silently skip on error
    if (row && row.count === 0) {
      db.all('SELECT id FROM users ORDER BY id LIMIT 3', (uErr, users) => {
        if (uErr) return;
        const ids = (users || []).map(u => u.id);

        const ensureUserId = (cb) => {
          if (ids.length > 0) return cb(ids);
          db.run('INSERT INTO users (name, email, age) VALUES (?, ?, ?)', ['Demo', 'demo@example.com', 20], function (iErr) {
            if (iErr) return;
            cb([this.lastID]);
          });
        };

        ensureUserId((useIds) => {
          const stmt = db.prepare('INSERT INTO posts (title, content, user_id) VALUES (?, ?, ?)');
          const u0 = useIds[0];
          const u1 = useIds[1] ?? u0;
          const u2 = useIds[2] ?? u0;
          const posts = [
            ['Welkom bij de API', 'Deze post legt kort uit hoe je de API gebruikt.', u0],
            ['Tweede post', 'Nog wat content om de lijst te vullen.', u1],
            ['API Tips', 'Gebruik /users en /posts met limit & offset.', u2],
          ];
          for (const p of posts) stmt.run(...p);
          stmt.finalize();
        });
      });
    }
  });
});

const run = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve({ lastID: this.lastID, changes: this.changes });
    });
  });

const get = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });

const all = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });

module.exports = { db, run, get, all };
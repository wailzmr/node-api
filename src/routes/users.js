const express = require('express');
const router = express.Router();
const { run, get, all } = require('../db');

function validateUser(body) {
  const errors = [];
  const name = body.name?.toString().trim();
  const email = body.email?.toString().trim();
  const ageNum = Number(body.age);

  if (!name) errors.push('name is required');
  if (name && /\d/.test(name)) errors.push('name cannot contain digits');

  if (!email) errors.push('email is required');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email && !emailRegex.test(email)) errors.push('email must be valid');

  if (!Number.isInteger(ageNum)) errors.push('age must be an integer');
  else if (ageNum < 0) errors.push('age must be >= 0');

  return { errors, value: { name, email, age: ageNum } };
}

// List users with optional pagination and search
router.get('/', async (req, res) => {
  try {
    const limit = req.query.limit !== undefined ? Number(req.query.limit) : 50;
    const offset = req.query.offset !== undefined ? Number(req.query.offset) : 0;
    const search = req.query.search?.toString().trim();

    if (!Number.isInteger(limit) || limit < 0) return res.status(400).json({ error: 'limit must be a non-negative integer' });
    if (!Number.isInteger(offset) || offset < 0) return res.status(400).json({ error: 'offset must be a non-negative integer' });

    let sql = 'SELECT id, name, email, age FROM users';
    const params = [];
    if (search) {
      sql += ' WHERE name LIKE ? OR email LIKE ?';
      params.push(`%${search}%`, `%${search}%`);
    }
    sql += ' ORDER BY id ASC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const rows = await all(sql, params);
    res.json({ data: rows, meta: { limit, offset, count: rows.length } });
  } catch (err) {
    res.status(500).json({ error: 'internal server error' });
  }
});

// Get user details
router.get('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ error: 'id must be an integer' });

    const user = await get('SELECT id, name, email, age FROM users WHERE id = ?', [id]);
    if (!user) return res.status(404).json({ error: 'user not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'internal server error' });
  }
});

// Create user
router.post('/', async (req, res) => {
  try {
    const { errors, value } = validateUser(req.body);
    if (errors.length) return res.status(400).json({ errors });

    const result = await run('INSERT INTO users (name, email, age) VALUES (?, ?, ?)', [value.name, value.email, value.age]);
    const created = await get('SELECT id, name, email, age FROM users WHERE id = ?', [result.lastID]);
    res.status(201).json(created);
  } catch (err) {
    if (err && err.message && err.message.includes('UNIQUE')) {
      return res.status(400).json({ error: 'email must be unique' });
    }
    res.status(500).json({ error: 'internal server error' });
  }
});

// Update user
router.put('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ error: 'id must be an integer' });

    const { errors, value } = validateUser(req.body);
    if (errors.length) return res.status(400).json({ errors });

    const result = await run('UPDATE users SET name = ?, email = ?, age = ? WHERE id = ?', [value.name, value.email, value.age, id]);
    if (result.changes === 0) return res.status(404).json({ error: 'user not found' });
    const updated = await get('SELECT id, name, email, age FROM users WHERE id = ?', [id]);
    res.json(updated);
  } catch (err) {
    if (err && err.message && err.message.includes('UNIQUE')) {
      return res.status(400).json({ error: 'email must be unique' });
    }
    res.status(500).json({ error: 'internal server error' });
  }
});

// Delete user
router.delete('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ error: 'id must be an integer' });

    const result = await run('DELETE FROM users WHERE id = ?', [id]);
    if (result.changes === 0) return res.status(404).json({ error: 'user not found' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'internal server error' });
  }
});

module.exports = router;
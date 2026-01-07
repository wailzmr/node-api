const express = require('express');
const router = express.Router();
const { run, get, all } = require('../db');

async function validatePost(body) {
  const errors = [];
  const title = body.title?.toString().trim();
  const content = body.content?.toString().trim();
  const userId = Number(body.user_id);

  if (!title) errors.push('title is required');
  if (!content) errors.push('content is required');

  if (!Number.isInteger(userId)) errors.push('user_id must be an integer');

  if (errors.length === 0) {
    const user = await get('SELECT id FROM users WHERE id = ?', [userId]);
    if (!user) errors.push('user_id must refer to an existing user');
  }

  return { errors, value: { title, content, user_id: userId } };
}

// List posts with optional pagination and search by title
router.get('/', async (req, res) => {
  try {
    const limit = req.query.limit !== undefined ? Number(req.query.limit) : 50;
    const offset = req.query.offset !== undefined ? Number(req.query.offset) : 0;
    const search = req.query.search?.toString().trim();

    if (!Number.isInteger(limit) || limit < 0) return res.status(400).json({ error: 'limit must be a non-negative integer' });
    if (!Number.isInteger(offset) || offset < 0) return res.status(400).json({ error: 'offset must be a non-negative integer' });

    let sql = 'SELECT id, title, content, user_id FROM posts';
    const params = [];
    if (search) {
      sql += ' WHERE title LIKE ?';
      params.push(`%${search}%`);
    }
    sql += ' ORDER BY id ASC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const rows = await all(sql, params);
    res.json({ data: rows, meta: { limit, offset, count: rows.length } });
  } catch (err) {
    res.status(500).json({ error: 'internal server error' });
  }
});

// Get post details
router.get('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ error: 'id must be an integer' });

    const post = await get('SELECT id, title, content, user_id FROM posts WHERE id = ?', [id]);
    if (!post) return res.status(404).json({ error: 'post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: 'internal server error' });
  }
});

// Create post
router.post('/', async (req, res) => {
  try {
    const { errors, value } = await validatePost(req.body);
    if (errors.length) return res.status(400).json({ errors });

    const result = await run('INSERT INTO posts (title, content, user_id) VALUES (?, ?, ?)', [value.title, value.content, value.user_id]);
    const created = await get('SELECT id, title, content, user_id FROM posts WHERE id = ?', [result.lastID]);
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: 'internal server error' });
  }
});

// Update post
router.put('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ error: 'id must be an integer' });

    const { errors, value } = await validatePost(req.body);
    if (errors.length) return res.status(400).json({ errors });

    const result = await run('UPDATE posts SET title = ?, content = ?, user_id = ? WHERE id = ?', [value.title, value.content, value.user_id, id]);
    if (result.changes === 0) return res.status(404).json({ error: 'post not found' });
    const updated = await get('SELECT id, title, content, user_id FROM posts WHERE id = ?', [id]);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'internal server error' });
  }
});

// Delete post
router.delete('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ error: 'id must be an integer' });

    const result = await run('DELETE FROM posts WHERE id = ?', [id]);
    if (result.changes === 0) return res.status(404).json({ error: 'post not found' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'internal server error' });
  }
});

module.exports = router;
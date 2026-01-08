const express = require('express');
const router = express.Router();
const pool = require('../../config/database');
const verifyJWT = require('../../middleware/verifyJWT');

router.get('/approved', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM "FEEDBACK" ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching approved feedback:', error);
    res.status(500).json({ message: 'Error fetching approved feedback' });
  }
});

router.get('/pending', verifyJWT, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM "FEEDBACK_ATTENTE" ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching pending feedback:', error);
    res.status(500).json({ message: 'Error fetching pending feedback' });
  }
});

router.post('/submit', async (req, res) => {
  try {
    const { name, email, message, rating } = req.body;

    if (!name || !message) {
      return res.status(400).json({ message: 'Name and message are required' });
    }

    const result = await pool.query(
      'INSERT INTO "FEEDBACK_ATTENTE" (name, email, message, rating) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email || null, message, rating || null]
    );

    res.status(201).json({
      message: 'Feedback submitted successfully',
      feedback: result.rows[0]
    });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ message: 'Error submitting feedback' });
  }
});

router.post('/approve/:id', verifyJWT, async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const selectResult = await client.query(
      'SELECT * FROM "FEEDBACK_ATTENTE" WHERE id = $1',
      [req.params.id]
    );

    if (selectResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Feedback not found' });
    }

    const feedback = selectResult.rows[0];

    await client.query(
      'INSERT INTO "FEEDBACK" (name, email, message, rating) VALUES ($1, $2, $3, $4)',
      [feedback.name, feedback.email, feedback.message, feedback.rating]
    );

    await client.query(
      'DELETE FROM "FEEDBACK_ATTENTE" WHERE id = $1',
      [req.params.id]
    );

    await client.query('COMMIT');

    res.json({ message: 'Feedback approved successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error approving feedback:', error);
    res.status(500).json({ message: 'Error approving feedback' });
  } finally {
    client.release();
  }
});

router.delete('/pending/:id', verifyJWT, async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM "FEEDBACK_ATTENTE" WHERE id = $1 RETURNING *',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    res.json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    console.error('Error deleting feedback:', error);
    res.status(500).json({ message: 'Error deleting feedback' });
  }
});

module.exports = router;

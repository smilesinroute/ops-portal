const express = require('express');
const router = express.Router();
const pool = require('../../../../shared/db');

router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM drivers'); // adjust table if needed
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching drivers');
    }
});

module.exports = router;

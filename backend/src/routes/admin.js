const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('✅ Ops admin route online');
});

module.exports = router;

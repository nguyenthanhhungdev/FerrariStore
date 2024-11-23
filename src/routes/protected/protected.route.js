const express = require('express');
const passport = require('passport');
const router = express.Router();
const auth = require('../../middleware/auth.middleware');

// Example of a protected route
router.get('/protected', auth, (req, res) => {
    res.json({ message: 'Success. You accessed a protected route.' });
});

module.exports = router;
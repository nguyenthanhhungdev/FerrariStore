const express = require('express');
const passport = require('passport');
const router = express.Router();

// Example of a protected route
router.get('/protected', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({ message: 'Success. You accessed a protected route.' });
});

module.exports = router;
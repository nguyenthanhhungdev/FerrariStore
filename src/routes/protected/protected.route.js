const express = require('express');
const passport = require('passport');
const router = express.Router();
const authentication = require('../../middleware/auth.middleware');


// Example of a protected route
router.get('/protected', authentication, (req, res) => {
    res.json({ message: 'Success. You accessed a protected route.' });
});

module.exports = router;
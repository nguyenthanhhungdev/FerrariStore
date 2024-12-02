const passport = require('passport');
const passportConfig = require('../configs/passport.config');

// Initialize passport configuration
passportConfig().then(r => console.log("Passport Configured"));

const auth = passport.authenticate('jwt', {session: false, failWithError: true});

module.exports = auth;

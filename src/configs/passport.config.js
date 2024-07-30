const passport = require('passport');
const {Strategy: JwtStrategy, ExtractJwt} = require('passport-jwt');
const {Customer} = require('../models/user.model'); // Adjust the path as necessary

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET, // The secret key used to sign the JWT
};

module.exports = passport => {
    passport.use(new JwtStrategy(options, async (jwt_payload, done) => {
        // Find the user by the JWT payload
        // Assuming the JWT payload contains the user ID in a 'userId' field
        await Customer.findById(jwt_payload.userId)
            .then(user => {
                    if (user) {
                        // If the user is found, return the user
                        return done(null, user);
                    }
                    // If the user is not found, return false
                    return done(null, false);
                }
            )
            .catch(error => {
                // If an error occurs, return the error
                console.log(error);
                return done(error, false);
            })
    }));
}
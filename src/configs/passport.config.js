const passport = require('passport');
const {Strategy: JwtStrategy, ExtractJwt} = require('passport-jwt');
const {User} = require('../models/user.model'); // Adjust the path as necessary

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Sending Token in Header Authorization
    secretOrKey: process.env.JWT_SECRET, // The secret key used to sign the JWT
};

passport.use(new JwtStrategy(options, async (jwt_payload, done) => {
    // Find the user by the JWT payload
    // Assuming the JWT payload contains the user ID in a 'userId' field
    await User.findById(jwt_payload.userId)
        .then((user, err) => {
                if (user) {
                    // If the user is found, return the user
                    return done(null, user);
                }
                if (err) {
                    // If an error occurs, return the error
                    console.log(":::E::: Error: Token Error",err);
                    return done(err, false);
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
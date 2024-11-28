const passport = require('passport');
const {Strategy: JwtStrategy, ExtractJwt} = require('passport-jwt');
const {User} = require('../models/user.model');
const logger = require('../utils/logger');
const CryptoJS = require('crypto-js');

logger.info("Load into Passport");
const options = {
    jwtFromRequest: (req) => {
        if (req && req.cookies && req.cookies['token']) {
            try {
                // Decrypt the token from cookies
                const bytes = CryptoJS.AES.decrypt(req.cookies['token'], process.env.TOKEN_SECRET);
                const decryptedToken = bytes.toString(CryptoJS.enc.Utf8);
                return decryptedToken;
            } catch (error) {
                logger.error("Error decrypting token:", error);
                return null;
            }
        }
        return null;
    },
    secretOrKey: process.env.JWT_SECRET,
};

passportConfig = async() => {
    passport.use(new JwtStrategy(options, async (jwt_payload, done) => {
        // Find the user by the JWT payload
        await User.findById(jwt_payload.userId)
            .then((user, err) => {
                    if (user) {
                        // If the user is found, return the user
                        return done(null, user);
                    }
                    if (err) {
                        // If an error occurs, return the error
                        logger.error(":::E::: Error: Token Error", err);
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
        passport.serializeUser((user, done) => {
            done(null, user.id);
        });

        passport.deserializeUser((id, done) => {
            User.findById(id, (err, user) => {
                done(err, user);
            });
        });
    }))
};

module.exports = passportConfig;

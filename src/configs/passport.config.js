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
                return bytes.toString(CryptoJS.enc.Utf8);
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
        try {
            const user = await User.findById(jwt_payload.userId);

            if (!user) {
                // Không tìm thấy user
                return done(null, false);
            }

            // Tìm thấy user, xác thực thành công
            return done(null, user);
        } catch (error) {
            // Lỗi trong quá trình truy vấn
            logger.error("Authentication error:", error);
            return done(error, false);
        }
    }));

    // Đặt serialize và deserialize ở ngoài
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (err) {
            done(err);
        }
    });
};;

module.exports = passportConfig;

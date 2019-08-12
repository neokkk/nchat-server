const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJWT;

const { User } = require('../models');
const { COOKIE_SECRET } = process.env;

module.exports = passport => {
    passport.use(
        new JWTStrategy({
            jwtFromRequest: ExtractJWT.fromAuthHeaderWithSchema('JWT'),
            secretOrKey: COOKIE_SECRET
        },
        async (jwt_payload, done) => {
            try {
                const exUser = await User.findOne({ where: { email: jwt_payload.email } });

                if (exUser) {
                    done(null, exUser);
                } else {
                    done(null, false);
                }
            } catch (err) {
                console.error('jwt error');
                done(err);
            }
        })
    )
}
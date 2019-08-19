const JWTStrategy = require('passport-jwt').Strategy,
      ExtractJWT = require('passport-jwt').ExtractJwt;

const { User } = require('../models');

module.exports = passport => {
    passport.use(
        new JWTStrategy({
            jwtFromRequest: ExtractJWT.fromAuthHeaderWithScheme('JWT'),
            secretOrKey: process.env.JWT_SECRET,
            session: false,
        },
        async (jwt_payload, done) => {
            try {
                const exUser = await User.findOne({ where: { email: jwt_payload.email } });

                if (exUser) {
                    console.log('user found in db in passport');
                    done(null, exUser);
                } else {
                    console.log('user not found in db');
                    done(null, false);
                }
            } catch (err) {
                console.log('jwt error');
                console.error(err);
                done(err);
            }
        })
    )
}
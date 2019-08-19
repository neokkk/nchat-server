const GoogleStrategy = require('passport-google-oauth2').Strategy;

const { User } = require('../models');

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;

module.exports = passport => {
    passport.use(new GoogleStrategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:5000/auth/google/callback',
        scope: ['https://www.googleapis.com/auth/userinfo.email', 
        'https://www.googleapis.com/auth/userinfo.profile']
    }, (accessToken, refreshToken, profile, done) => {
        if (profile.verified) {
            User
                .findOrCreate({ 
                    where: { email: profile.email }, 
                    defaults: { nick: profile.displayName } 
                })
                .spread((user, created) => {
                    if (user) done(null, user);
                    if (created) {
                        User.findOne({ where: { email: profile.email } })
                            .then(result => {
                                done(null, result);
                            });
                    }
                });
        }
    }))
}
const local = require('./localStrategy'),
      google = require('./googleStrategy');

const { User } = require('../models');

module.exports = passport => {
  passport.serializeUser((user, done) => {
    console.log('serialize user');
    console.log(user.id);
    done(null, user.id); // done(err, success, fail)
  });

  passport.deserializeUser((id, done) => {
    console.log('deserialize user');
    User.findOne({
            where: { id },
        })
        .then(user => {
            console.log('user');
            console.log(user);
            done(null, user);
        })
        .catch(err => {
            done(err);
        });
  });

  local(passport);
  google(passport);
  // jwt(passport);
};

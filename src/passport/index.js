const local = require('./localStrategy');

const { User } = require('../models');

module.exports = (passport) => {
  console.log('configuring user restoration...');
  passport.serializeUser((user, done) => {
    console.log('serial');
    done(null, user.id); // done(err, success, fail)
  });

  passport.deserializeUser((id, done) => {
    console.log('deserial');
    // User
    //     .findOne({
    //         where: { id },
    //     })
    //     .then(user => {
    //         done(null, user);
    //     })
    //     .catch(err => {
    //         console.log('error occured');
    //         console.log(err)
    //         done(err)
    //     });
    console.log('in deserializeUser id');
    console.log(id);
  });

  local(passport);
};

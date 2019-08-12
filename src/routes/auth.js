const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');

const router = express.Router();

const { User } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

router.post('/join', async (req, res, next) => {
  const { nick, email, pwd } = req.body;
  const hash = await bcrypt.hash(pwd, 12);

  await User.findOrCreate({ where: { email }, defaults: { nick, email, password: hash } })
            .spread((user, created) => {
                if (created) {
                    console.log('created!');
                    res.status(200).send({ message: '회원가입되었습니다.' });
                } else {
                    console.log('already been');
                    res.status(200).send({ message: '이미 존재하는 회원입니다.' });
                }
            })
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (authError, user) => {
    if (authError) {
      console.error(authError);
      next(authError);
    }

    if (!user) {
      req.flash('loginError', '존재하지 않는 회원입니다.');
    }

    req.login(user, loginError => {
      if (loginError) {
        console.error(loginError);
        next(loginError);
      }

      res.status(200).send({ user });
    });
  })(req, res, next);
});

router.get('/logout', (req, res) => {
  req.logout();
  req.session.destroy();
});

module.exports = router;

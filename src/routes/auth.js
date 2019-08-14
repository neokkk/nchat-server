const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');

const router = express.Router();

const { User } = require('../models');

// join
router.post('/join', async (req, res, next) => {
  const { nick, email, pwd } = req.body;

  try {
    const hash = await bcrypt.hash(pwd, 12);
  
    await User
      .findOrCreate({ where: { email }, defaults: { nick, email, password: hash } })
      .spread((user, created) => {
          if (created) {
              res.send({ message: '회원가입되었습니다.' });
          } else {
              res.send({ message: '이미 존재하는 회원입니다.' });
          }
      });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// local login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (authError, user) => {

    if (authError) {
      console.error(authError);
      next(authError);
    }

    if (!user) {
      res.send({ message: '로그인에 실패하였습니다.' });
    }

    req.login(user, loginError => {
      if (loginError) {
        console.error(loginError);
        next(loginError)
      }

      res.send({ user });
    });
  })(req, res, next);
});

// logout
router.get('/logout', (req, res) => {
  req.logout();
  req.session.destroy();
});

module.exports = router;

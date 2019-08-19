const express = require('express'),
      passport = require('passport'),
      bcrypt = require('bcrypt');

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

// google login
router.get('/google', passport.authenticate('google'));

// google login callback
router.get('/google/callback', passport.authenticate('google', {
  successRedirect: '/google/callback/success',
  failureRedirect: '/google/callback/failure'
}));

// google login success 
router.get('/google/callback/success', (req, res) => {
  if (req.isAuthenticated()) {
    res.send({ user: req.user });
  }
});

// google login failure
router.get('/google/callback/failure', (req, res) => {
  res.send({ message: '구글 로그인에 실패하였습니다.' });
});

module.exports = router;

const express = require('express'),
      bcrypt = require('bcrypt')
      jwt = require('jsonwebtoken');

const router = express.Router();

const { User } = require('../models');

// join
router.post('/join', async (req, res, next) => {
  const { nick, email, pwd } = req.body;

  try {
    const hash = await bcrypt.hash(pwd, 12);
  
    User
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
router.post('/login', async (req, res, next) => {
  const { email, pwd } = req.body,
        secret = process.env.JWT_SECRET;

  try {
    const exUser = await User.findOne({ where: { email } });
    
    if (exUser) { // user가 존재하면
      const validation = await bcrypt.compare(pwd, exUser.password);

      if (validation) { // 비밀번호가 맞으면
        const token = jwt.sign({ id: exUser.id, nick: exUser.nick }, secret, { expiresIn: '1d' });
  
        res.cookie('token', token);
        res.send({ user: exUser, token });
      } else {
        res.send({ message: '로그인에 실패하였습니다.' });
      }
    } else {
      res.send({ message: '로그인에 실패햐였습니다.' });
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// logout
router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.send({ message: '로그아웃 되었습니다.' });
});

module.exports = router;

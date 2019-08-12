const express = require('express');

const { Room, Chat } = require('../models');
// const { isLoggedIn } = require('./middlewares');

const router = express.Router();

router.get('/list', async (req, res, next) => {
    await Room.findAll()
              .then(rooms => { 
                  console.log('rooms');
                  res.send(rooms);
              })
              .catch(err => {
                  console.error(err);
                  next(err);
              });
});

router.post('/', async (req, res, next) => {
    const { roomName, roomLimit, roomPwd } = req.body;

    await Room.create({
        name: roomName,
        host: req.user,
        limit: roomLimit,
        password: roomPwd === '' ? null : roomPwd
    })
              .then(result => {
                  console.log('result');
                  res.send(result);
              })
              .catch(err => {
                  console.error(err);
                  next(err);
              });
});

router.post('/:id/chat', async (req, res) => {
    const { input } = req.body.data,
          { id } = req.params;

    await Chat.create({
        chat: input,
        roomId: id,
    });
});

router.get('/search', async (req, res, next) => {
    const { query } = req;

    await Room.findAll({
        where: { 
            name: {
                [sequelize.Op.like]: `%${query}%`
            }
        }
    })
              .then(result => {
                 console.log('search room');
                 console.log(result);
              })
              .catch(err => {
                 console.error(err);
                 next(err);
              });
});

router.delete('/:id', async (req, res, next) => {
    const { id } = req.params;

    await Room.destroy({ where: { id } });
});

module.exports = router;
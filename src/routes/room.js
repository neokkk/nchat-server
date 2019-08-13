const express = require('express'),
      sequelize = require('sequelize');

const { Room, Chat } = require('../models');

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
    const { roomName, roomSubname, roomLimit, roomPwd, user } = req.body;

    await Room.create({
        name: roomName,
        subname: roomSubname,
        host: user.nick,
        limit: roomLimit,
        password: roomPwd === '' ? null : roomPwd
    })
              .then(result => {
                  res.send(result);
              })
              .catch(err => {
                  console.error(err);
                  next(err);
              });
});

router.post('/:id/chat', async (req, res) => {
    const { user, input } = req.body,
          { id } = req.params;

    await Chat.create({
        message: input,
        roomId: id,
        userId: user.id
    });
});

router.get('/search', async (req, res, next) => {
    const { query } = req.query;
    console.log('query');
    console.log(query);

    await Room
        .findAll({
            where: { 
                name: { [sequelize.Op.like]: `%${query}%` }
            }
        })
        .then(result => {
            res.send(result);
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
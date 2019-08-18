const express = require('express'),
      sequelize = require('sequelize');

const { Room, Chat } = require('../models');

const router = express.Router();

// get list
router.get('/list', (req, res, next) => {
    Room.findAll()
        .then(result => { 
            res.send(result);
        })
        .catch(err => {
            console.error(err);
            next(err);
        });
});

// create room
router.post('/', (req, res, next) => {
    const { roomName, roomSubname, roomLimit, roomPwd, user } = req.body;

    Room.create({
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

// create chat
router.post('/:id/chat', (req, res) => {
    const { user, input } = req.body,
          { id } = req.params;

    Chat.create({
            message: input,
            roomId: id,
            userId: user.id
        })
        .then(result => {
            res.send(result);
        })
        .catch(err => {
            console.error(err);
            next(err);
        });

});

// search room
router.get('/search', (req, res, next) => {
    const { query } = req.query;

    Room
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

// delete room
router.delete('/:id', (req, res, next) => {
    const { id } = req.params;

    setTimeout(() => {
        Room.destroy({ where: { id } });
    }, 3000);
});

module.exports = router;
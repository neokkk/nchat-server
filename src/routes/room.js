const express = require('express'),
      sequelize = require('sequelize');

const { Room, Chat } = require('../models');

const router = express.Router();

// get list
router.get('/list', (req, res, next) => {
    Room.findAll()
        .then(rooms => { 
            console.log('rooms');
            res.send(rooms);
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
            console.log('create room result');
            console.log(result);
            res.send(result);
        });
});

// create chat
router.post('/:id/chat', async (req, res, next) => {
    const { user, input } = req.body,
          { id } = req.params;

    try {
        await Chat
            .create({
                message: input,
                roomId: id,
                userId: user.id
            });
    } catch (err) {
        console.error(err);
        next(err);
    }

    res.status(200).json({ success: true });
});

// search room
router.get('/search', async (req, res, next) => {
    const { query } = req.query;

    try {
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
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// delete room
router.delete('/:id', async (req, res, next) => {
    const { id } = req.params;

    try {
        await Room.destroy({ where: { id } });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;
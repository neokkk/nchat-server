const jwt = require('jsonwebtoken');

exports.isLoggedIn = (req, res, next) => {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded) {
        next();
    } else {
        res.status(403).send('로그인이 필요합니다.');
    }
}
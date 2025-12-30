const jwt = require('jsonwebtoken');
require('dotenv').config();

const optionalJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        return next();
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) {
                return next();
            }
            req.user = decoded.UserInfo.email;
            req.userId = decoded.UserInfo.userId;
            req.role = decoded.UserInfo.role;
            req.roles = decoded.UserInfo.roles || [];
            next();
        }
    );
}

module.exports = optionalJWT;

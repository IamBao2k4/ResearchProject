const jwt = require('jsonwebtoken');
const Users = require("../app/models/Users");

async function authMiddleware(req, res, next) {
    try {
        const userId = req.user._id;
        req.user = await Users.findById(userId);
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
}

module.exports = authMiddleware;
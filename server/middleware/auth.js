// 4.4. Create /server/middleware/auth.js that verifies JWT from Authorization header
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({message: 'Unauthorized: No token provided'});
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({message: 'Unauthorized: No token provided'});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({message: 'Unauthorized: Invalid token'});
    }

}

module.exports = authMiddleware;
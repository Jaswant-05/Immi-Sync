const jwt = require("jsonwebtoken");
require('dotenv').config()

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({
            message : "Invalid Auth Token"
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;
        const role = decoded.role;
        
        req.userId = userId;
        req.user_role = role;
    
        next();
    } catch (err) {
        return res.status(403).json({ 
            message : "Invalid Auth Token"
        });
    }
};

module.exports = {
    authMiddleware
}
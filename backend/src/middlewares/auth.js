const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {

    // Get header value: "Bearer <token>"
    const authHeader = req.headers['authorization'];

    if(!authHeader) {
        return res.status(403).json({success:false,data:"No token provided. Access DENIED."});
    }

    // Split "Bearer" and token string
    const token = authHeader.split(' ')[1];
    if(!token) {
        return res.status(403).json({success:false,data:"Malformed token"})
    }

    try {
        // Verify secret signature
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');

        req.user = decoded;

        next(); // Move to next middleware
    } catch (err) {
        return res.status(401).json({success:false,data:`Invalid or expired token: ${err.message}`})
    }
}

module.exports = { verifyToken }
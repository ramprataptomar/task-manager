const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect routes
const protect = async(req, res, next) => {
    try {
        let token = req.headers.authorization;

        if(token && token.startsWith('Bearer')){
            token = token.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            
            req.user = await User.findById(decoded.id).select('-password');
            next();
        }
        else{
            res.status(401).json({message: 'Not authorized, not token'});
        }
    }
    catch (error){
        res.status(401).json({message: 'Token failed', error: error.message});
    }
}

const adminOnly = (req, res, next) => {
    if(req.user && req.user.role === 'admin'){
        next();
    }
    else{
        res.status(401).json({message: 'Access denied, not an admin'});
    }
}

module.exports = { protect, adminOnly };
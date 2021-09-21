const HttpStatus = require('http-status-codes');
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const token = req.headers['authorization'];
    
    if (token) {
        jwt.verify(token, process.env.TOKEN_SECRET_KEY, (err, decoded) => { 
            if (err) {
               return res.json({ status: 401, error: 'You are not authorized to perform this operation!' }); 
            } else {
                req.decodedToken = decoded
                next(); 
            } 
        });
    } else {
       return res.json({ status: 401, error: 'No token provided' });
    }
};

module.exports = auth
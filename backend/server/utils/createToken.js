const jwt = require('jsonwebtoken');

const tokens = async (data) => {
    const token = await jwt.sign(data, process.env.TOKEN_SECRET_KEY, { expiresIn: '365d' });
    return token;
}

module.exports = tokens
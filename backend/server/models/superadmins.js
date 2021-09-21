const mongoose = require("mongoose");

const superadmins = mongoose.model('superadmins', new mongoose.Schema({
    email: {
        type: String
    },
    name: {
        type: String,
        default: ''
    },
    image: {
        type: String,
        default: ''
    },
    password: {
        type: String
    },
    fcm: {
        type: String
    },
    type: {
        type: String,
        enum: ['admin', 'sales'],
        default: 'sales'
    }
}))

exports.superadmins = superadmins;

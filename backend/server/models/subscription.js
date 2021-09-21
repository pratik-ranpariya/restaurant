const mongoose = require("mongoose");

const subscription = mongoose.model('subscriptions', new mongoose.Schema({
    restaurant_id: {
        type: mongoose.Schema.Types.ObjectId
    },
    start_date: {
        type: Date
    },
    end_date: {
        type: Date
    },
    subcription_running: {
        type: Boolean,
        default: false
    },
    subcription_accepted_admin: {
        type: String,
        default: 'pending',
        enum: ['pending', 'accepted', 'complated', 'canceled', 'stopped']
    },
    subcription_type: {
        type: String,
        enum: ['take_away', 'dining_table', 'hotel'],
        default: 'take_away'
    },
    price: {
        type: Number
    },
    payment_type: {
        type: String,
        enum: ['cash', 'razorpay'],
        default: 'razorpay'
    }
}))

exports.subscription = subscription;

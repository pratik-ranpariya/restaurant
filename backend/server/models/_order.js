const mongoose = require("mongoose");

const order = mongoose.model('orders', new mongoose.Schema({
    order_id: {
        type: Number
    },
    restaurant_id: {
        type: mongoose.Schema.Types.ObjectId
    },
    item: [{
        name: {
            type: String
        },
        price: {
            type: Number
        },
        quentity: {
            type: Number
        }
    }],
    start_time: {
        type: Date,
        default: new Date()
    },
    end_time: {
        type: Date,
        default: null
    },
    totalprice: {
        type: Number
    },
    payment: {
        type: String,
        enum: ["google_pay", "phone_pe", "paytm"],
        require: true
    },
    status: {
        type: String,
        enum: ["success", "inprogress", "pending", "cancel"],
        default: 'pending'
    },
    dining_table: {
        dining_table: {
            type: Boolean
        },
        diningtable_id: {
            type: Number
        }
    }
}))

exports.order = order;
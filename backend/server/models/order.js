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
        },
        size: {
            type: String,
            default: 'full'
        },
	image: {
            type: String,
            default: ''
        },
        category: {
            type: String,
            default: ''
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
    payment_type: {
        type: String,
        enum: ["google_pay", "phone_pe", "paytm", "cod"],
        require: true
    },
    payment_status: {
        type: String,
        enum: ["pending", "success", "failed"],
        require: true
    },
    status: {
        type: String,
        enum: ["success", "inprogress", "pending", "cancel"],
        default: 'pending'
    },
    desc: {
        type: String,
        default: ''
    },
    type: {
        type: {
            type: String
        },
        table_number: {
            type: Number,
            default: null
        },
        room_number: {
            type: Number,
            default: null
        }
    }
}))

exports.order = order;

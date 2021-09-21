const { restaurant } = require("../../models/restaurants")
const { order } = require('../../models/order')
const { imps } = require("../../models/imps")
const { subscription } = require('../../models/subscription')
const { superadmins } = require('../../models/superadmins')
const uniqid = require('randomatic')
const moment = require('moment')
const currentTime = require('../../utils/currentTime')
const FirebaseNotification = require('../../utils/notification')

class user {
    static restaurantMenu = async (req, res) => {
        try {
            const { restaurant_id, dining_number, room_number } = req.query
            const queryFire = await restaurant.findOne({ _id: restaurant_id }, { menu: 1, _id: 1, name: 1, restaurent_logo: 1 })
            const queryFire2 = await restaurant.findOne({ _id: restaurant_id })
            var data = {
                _id: queryFire._id,
            }
           /* if(room_number) {
                data['room_number'] = room_number ? parseInt(room_number) : null
            }
            if(dining_number){
                data['dining_number'] = dining_number ? parseInt(dining_number) : null
            } */
		console.log(room_number)
	    if (room_number) {
                const ifdiningExist = queryFire2.restaurant_type.rooms.some((data) =>
                    parseInt(data.room_id) == parseInt(room_number)
                )
                if (ifdiningExist) {
                    data['room_number'] = room_number ? parseInt(room_number) : null
                } else {
                    return res.json({ status: 500, msg: 'room not found' })
                }
            }
            if (dining_number) {
                const ifdiningExist = queryFire2.restaurant_type.dining_table.some((data) =>
                    parseInt(data.dining_table_id) == parseInt(dining_number)
                )
                if (ifdiningExist) {
                    data['dining_number'] = dining_number ? parseInt(dining_number) : null
                } else {
                    return res.json({ status: 500, msg: 'dining table not found' })
                }
            }
	    data['name'] = queryFire.name
            data['restaurent_logo'] = queryFire.restaurent_logo

	    function dynamicSort(property) {
                var sortOrder = 1;
                if(property[0] === "-") {
                    sortOrder = -1;
                    property = property.substr(1);
                }
                return function (a,b) {
                    var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
                    return result * sortOrder;
                }
            }
            queryFire.menu.sort(dynamicSort("type"))

            data['menu'] = queryFire.menu

            return res.json({ status: 200, data: data })
        } catch (e) {
            console.log(e);
            return res.json({ status: 500, msg: 'internal server error' })
        }
    }

    static order = async (req, res) => {
        try {
            req.body.order_id = uniqid('0', 13)
            req.body.start_time = currentTime()
            const newOrder = order(req.body)
            const makeOrder = await newOrder.save()

	    if(makeOrder.payment_status !== 'failed'){
                const fcm = await restaurant.findOne({_id: makeOrder.restaurant_id}, {_id: 0, fcm: 1})
                if(Object.keys(fcm).length){
                    await FirebaseNotification(fcm.fcm, 'You have received an Order')
                }
            }

            makeOrder.start_time = moment(new Date(makeOrder.start_time)).format('DD MM YYYY h:mm A')
            console.log(makeOrder.start_time)
            return res.json({status: 200, data: makeOrder})
        } catch (e) {
            console.log(e.message);
            return res.json({ status: 500, msg: 'internal server error' })
        }
    }

    static forloop = async (req, res) => {
        try {
            var starttime = new Date()
            for (let i = 0; i < parseInt(req.query.number); i++) {
            }
            return res.json({time: new Date() - starttime})
        } catch (e) {
            console.log(e);
        }
    }

    static checkOrder = async (req, res) => {
        try {
            console.log(req.query.order_id);
            const check = await order.findOne({order_id: req.query.order_id})
            console.log(check);
            if(check){
                return res.json({ status: 200, data: check })
            } else {
                return res.json({status: 404, msg: 'order not found'})
            }
        } catch (e) {
            console.log(e);
            return res.json({status: 500, msg: 'internal server error'})
        }
    }

    static getUpi = async (req, res) => {
        try {
            const check = await order.findOne({restaurant_id: req.query.restaurant_id})
            console.log(check);
            if(check){
                return res.json({ status: 200, data: check })
            } else {
                return res.json({status: 404, msg: 'order not found'})
            }
        } catch (e) {
            console.log(e);
            return res.json({status: 500, msg: 'internal server error'})
        }
    }
}

module.exports = user;

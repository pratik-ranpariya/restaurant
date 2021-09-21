const { restaurant } = require("../../models/restaurants")
const { order } = require('../../models/order')
const { imps } = require("../../models/imps")
const { subscription } = require('../../models/subscription')
const { superadmins } = require('../../models/superadmins')
const uniqid = require('randomatic')

class user {
    static restaurantMenu = async (req, res) => {
        try {
            const { restaurant_id, dining_number } = req.query
            const queryFire = await restaurant.findOne({ _id: restaurant_id }, { menu: 1, _id: 1 })

            const data = {
                _id: queryFire._id,
                dining_table: dining_number ? parseInt(dining_number) : null,
                menu: queryFire.menu
            }

            return res.json({ status: 200, data: data })

        } catch (e) {
            console.log(e.message);
            return res.json({ status: 500, msg: 'internal server error' })
        }
    }

    static order = async (req, res) => {
        try {
            req.body.order_id = uniqid('0', 8)
            const ff = order(req.body)
            const fff = await ff.save()

            return res.json({status: 200, msg: 'order placed successfully'})
        } catch (e) {
            console.log(e.message);
            return res.json({ status: 500, msg: 'internal server error' })
        }
    }
}

module.exports = user;
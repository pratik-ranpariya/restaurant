const { subscription } = require('../models/subscription')

const ifsubcriptions = async (req, res, next) => {
    try {
        const { restaurant_id } = req.query

        if (restaurant_id) {

            var wh = {}

            wh['$and'] = [{
                start_date: {
                    $lte: new Date(new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate() + ' 00:00:00')
                }
            },
            {
                start_date: {
                    $gte: new Date(new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate() + ' 00:00:00')
                }
            },
            { subcription_running: true },
            { subcription_accepted_admin: 'accepted' },
            { restaurant_id: restaurant_id }]

            const existSubcription = await subscription.findOne(wh)

            if(existSubcription){
                if(existSubcription.subcription_type === 'hotel'){
                    next()
                } else if(existSubcription.subcription_type === 'dining_table'){
                    if(req.query.dining_number){
                        next()
                    } else {
                        return res.json({status: 401, msg: 'access take_away and dining_table orders only.'})
                    }
                } else if(existSubcription.subcription_type === 'take_away'){
                    if(req.query.dining_number || req.query.room){
                        return res.json({status: 401, msg: 'access take_away orders only'})
                    } else {
                        next()
                    }
                } else {
                    return res.json({status: 401, msg: 'access only take_away, dining_table and rooms orders only'})
                }
            } else {
                return res.json({status: 401, msg: 'does not found any subcription so you can not access any restaurant menu'})
            }
        } else {
            return res.json({ status: 500, msg: 'fill all detail' })
        }
    } catch (e) {
        console.log(e.message);
        return res.json({ status: 500, msg: 'internal server error' })
    }

}

module.exports = ifsubcriptions
const { subscription } = require('../models/subscription')
const currentTime = require('../utils/currentTime')

const ifsubcriptions = async (req, res, next) => {
    try {
        const { restaurant_id, room_number, dining_number } = req.query

        if (restaurant_id) {

            var wh = {}

            wh['$and'] = [{
                start_date: {
                    $lte: currentTime(currentTime().getFullYear() + '-' + (currentTime().getMonth() + 1) + '-' + currentTime().getDate() + ' 00:00:00')
                }
            },
            {
                end_date: {
                    $gte: currentTime(currentTime().getFullYear() + '-' + (currentTime().getMonth() + 1) + '-' + currentTime().getDate() + ' 00:00:00')
                }
            },
            { subcription_running: true },
            { subcription_accepted_admin: { $in: ['stopped', 'accepted'] } },
            { restaurant_id: restaurant_id }]

            const existSubcription = await subscription.findOne(wh)

           /* if(existSubcription){
                if(existSubcription.subcription_type === 'hotel'){
                    next()
                } else if(existSubcription.subcription_type === 'dining_table'){
                    if(!req.query.room_number){
                        next()
                    } else {
                        return res.json({status: 401, msg: 'access take_away and dining_table orders only.'})
                    }
                } else if(existSubcription.subcription_type === 'take_away'){
                    if(req.query.dining_number || req.query.room_number){
                        return res.json({status: 401, msg: 'access take_away orders only'})
                    } else {
                        next()
                    }
                } else {
                    return res.json({status: 401, msg: 'access only take_away, dining_table and rooms orders only'})
                }
            } else {
                return res.json({status: 401, msg: 'does not found any subcription so you can not access any restaurant menu'})
            } */

		if (existSubcription) {
                switch (existSubcription.subcription_type) {
                    case 'hotel':
                        if(existSubcription.subcription_accepted_admin !== 'stopped'){
                            next()
                        } else {
                            return res.json({status: 401, msg: 'service not available'})
                        } 
                        break;

                    case 'dining_table':
                        if(!room_number){
                            if(existSubcription.subcription_accepted_admin !== 'stopped'){
                            next()
                        } else {
                            return res.json({status: 401, msg: 'service not available'})
                        }
                        } else {
                            return res.json({status: 401, msg: 'access take_away and dining_table orders only.'})
                        }
                        break;

                    case 'take_away':
                        if(dining_number || room_number){
                            return res.json({status: 401, msg: 'access take_away orders only'})
                        } else {
                            if(existSubcription.subcription_accepted_admin !== 'stopped'){
                            next()
                        } else {
                            return res.json({status: 401, msg: 'service not available'})
                        }
                        }
                        break;

                    default:
                        res.json({status: 401, msg: 'access only take_away, dining_table and rooms orders only'})
                        break;
                }
            } else {
                return res.json({status: 401, msg: 'does not found any subcription so you can not access this restaurant menu'})
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

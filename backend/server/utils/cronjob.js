const schedule = require('node-schedule')
const { subscription } = require('../models/subscription')
const currentTime = require('../utils/currentTime')

module.exports = async() => {
    schedule.scheduleJob('* 0 0 * * *', async () => { // call every 12am mid-night
        const aggregation = [
            {
                $project: {
                    day: {
                        $dayOfMonth: "$end_date"
                    },
                    month: {
                        "$month": "$end_date"
                    },
                    year: {
                        "$year": "$end_date"
                    },
                    restaurant_id: 1,
                    status: 1,
                    _id: 1,
                    subcription_running: 1,
                    subcription_accepted_admin: 1
                }
            },
            {
                $match: {
                    day: (currentTime().getDate() - 1 ),
                    month: (currentTime().getMonth() + 1),
                    year: currentTime().getFullYear(),
                    subcription_running: true,
                    subcription_accepted_admin: 'accepted'
                }
            }
        ]
    
        const allsubcriptions = await subscription.aggregate(aggregation)
    
        const allIds = []
        for (let i = 0; i < allsubcriptions.length; i++) {
            allIds.push(allsubcriptions[i]._id)
            let query = { _id: allsubcriptions[i]._id.toString() },
                update = {
                    $set: {
                        subcription_running: false,
                        subcription_accepted_admin: 'complated'
                    }
                },
                options = { new: true }
    
            const uploadMenu = await subscription.updateOne(query, update, options)
        }
    })
}

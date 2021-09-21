const mongoose = require("mongoose");
const fs = require('fs');
const { restaurant } = require("../../models/restaurants");
const { order } = require('../../models/order')
const { imps } = require("../../models/imps")
const { subscription } = require('../../models/subscription')
const { superadmins } = require('../../models/superadmins')
const fileUpload = require("../../utils/fileupload")
const token = require('../../utils/createToken');
const { ObjectId } = require("mongodb");
const pdf = require("pdf-creator-node")
const mailer = require('../../utils/mailer')
const currentTime = require('../../utils/currentTime')

class superAdmin {

    static login = async (req, res) => {
        try {

           /*  const ff = superadmins({
                 email: 'admin',
                 password: 'admin'
             })

             const fff = await ff.save()

             return */


            const { email, password } = req.body
            const loginData = await superadmins.findOne({ email, password }, { password: 0, __v: 0 })

            if (loginData) {

                const tokenCreate = await token({ email: loginData.email, _id: loginData._id.toString() })

                const data = {
                    _id: loginData._id.toString(),
                    email: loginData.email,
                    type: loginData.type,
                    token: tokenCreate
                }

                return res.json({ status: 200, data: data })

            } else {
                return res.json({ status: 500, msg: 'email and password not valid' })
            }

        } catch (e) {
		console.log(e)
            return res.json({ status: 500, msg: 'internal server error' })
        }
    }

    static dashboard = async (req, res) => {
        try {
            var allSubData = {
                subcription_running: true,
                subcription_accepted_admin: 'accepted'
            }

            const aggregation = [
                {
                    $project: {
                        month: {
                            "$month": "$start_time"
                        },
                        year: {
                            "$year": "$start_time"
                        },
                        restaurant_id: 1,
                        status: 1
                    }
                },
                {
                    $match: {
                        month: (currentTime().getMonth() + 1),
                        year: currentTime().getFullYear(),
                    }
                },
            ]

            const orderData = await order.aggregate(aggregation)
            const allsubcriptionData = await subscription.find(allSubData)
            const allRestaurent = await restaurant.countDocuments()


            var active = [], inactive = [], renue = []
            for (let j = 0; j < allsubcriptionData.length; j++) {

                if ((allsubcriptionData[j].subcription_running === true &&
                    allsubcriptionData[j].subcription_accepted_admin === 'accepted' &&
                    allsubcriptionData[j].start_date < currentTime() &&
                    allsubcriptionData[j].end_date > currentTime())) {

                    const diffTime = Math.abs(allsubcriptionData[j].end_date - new Date);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    // console.log(diffDays);

                    if (diffDays > 5) {
                        active.push(allsubcriptionData[j]._id)
                    } else {
                        renue.push(allsubcriptionData[j]._id)
                    }
                }
            }

            var successorder = [], cancleorder = [];
            for (let i = 0; i < orderData.length; i++) {
                const element = orderData[i];

                if (element.status === 'success') {
                    successorder.push(element.order_id)
                }
                if (element.status === 'cancel') {
                    cancleorder.push(element.order_id)
                }

            }

            var countData = {
                active: active.length,
                inactive: allRestaurent - (active.length + renue.length),
                renue: renue.length,
                totalorder: orderData.length,
                deleveredorder: successorder.length,
                cancleorder: cancleorder.length
            }

            return res.json({ status: 200, data: countData })
        } catch (e) {
            console.log(e.message);
            return res.json({ status: 500, msg: 'internal server error' })
        }
    }

    static createRestAccount = async (req, res) => {
        try {

            const ifEmailExist = await restaurant.findOne({email: req.body.email})
            const ifUsernameExist = await restaurant.findOne({username: req.body.username})
            
            if(ifEmailExist){
                return res.json({ status: 500, msg: 'Email already exist.' })
            } else if(ifUsernameExist){
                return res.json({ status: 500, msg: 'Username already exist.' })
            }

            const saveData = restaurant(req.body)
            const mydata = await saveData.save()

            if (req.body.plans === 'take_away') {

                let query = { _id: mydata._id },
                    update = {
                        $set:
                        {
                            "restaurant_type.restaurant_type": req.body.plans
                        }
                    },
                    options = { new: true }
                const uploadMenu = await restaurant.updateOne(query, update, options)

            } else if (req.body.plans === 'dining_table') {

                var tables = []
                for (let i = 0; i < parseInt(req.body.dining); i++) {
                    tables.push({ dining_table_id: i + 1 })
                }
                let query = { _id: mydata._id },
                    update = {
                        $set:
                        {
                            "restaurant_type.restaurant_type": req.body.plans,
                            "restaurant_type.dining_table": tables
                        }
                    },
                    options = { new: true }
                const uploadMenu = await restaurant.updateOne(query, update, options)

            } else if (req.body.plans === 'hotel') {

                var tables = []
                for (let i = 0; i < parseInt(req.body.dining); i++) {
                    tables.push({ dining_table_id: i + 1 })
                }
                var rooms = []
                for (let i = 0; i < parseInt(req.body.room); i++) {
                    rooms.push({ room_id: i + 1 })
                }

                let query = { _id: mydata._id },
                    update = {
                        $set:
                        {
                            "restaurant_type.restaurant_type": req.body.plans,
                            "restaurant_type.dining_table": tables,
                            "restaurant_type.rooms": rooms
                        }
                    },
                    options = { new: true }
                const uploadMenu = await restaurant.updateOne(query, update, options)

            }

            var someDate = currentTime(currentTime().getFullYear() + '-' + (currentTime().getMonth() + 1) + '-' + currentTime().getDate() + ' 00:00:00');
            var endTime = someDate.setDate(someDate.getDate() + 28)

            const savesData = subscription({
                start_date: currentTime(currentTime().getFullYear() + '-' + (currentTime().getMonth() + 1) + '-' + currentTime().getDate() + ' 00:00:00'),
                end_date: endTime,
                subcription_type: req.body.plans,
                restaurant_id: mydata._id,
                subcription_running: true,
                subcription_accepted_admin: "accepted",
                price: 0
            })

            const fireQuery = await savesData.save()
            return res.json({status: 200, msg: 'account created successfully'})

        } catch (e) {
            console.log(e.message);
            return res.json({ status: 500, msg: 'internal server error' })
        }
    }

    static restaurantsTable = async (req, res) => {
        try {
            const allRestaurent = await restaurant.find({}, {password: 0, menu: 0, __v: 0, state: 0, country: 0, created_date: 0, restaurant_type: 0, restaurent_logo: 0})
            return res.json({status: 200, data: allRestaurent})
        } catch (e) {
            console.log(e)
            return res.json({ status: 500, msg: 'internal server error' })
        }
    }

    static rastaurentDetail = async (req, res) => {
        try {
            const { restaurant_id } = req.query
            const aggregation = [
                {
                    $project: {
                        month: {
                            "$month": "$start_time"
                        },
                        year: {
                            "$year": "$start_time"
                        },
                        restaurant_id: 1,
                        status: 1
                    }
                },
                {
                    $match: {
                        month: (currentTime().getMonth() + 1),
                        year: currentTime().getFullYear(),
                        restaurant_id: ObjectId(restaurant_id)
                    }
                },
                {
                    $count: 'total'
                }
            ]

            const monthlyData = await order.aggregate(aggregation)
            const allOrder = await order.find({restaurant_id: restaurant_id})

            var successorder = [], cancleorder = [];
            for (let i = 0; i < allOrder.length; i++) {
                const element = allOrder[i];

                if (element.status === 'success') {
                    successorder.push(element.order_id)
                }
                if (element.status === 'cancel') {
                    cancleorder.push(element.order_id)
                }

            }

            var countData = {
                allorder: allOrder.length,
                monthlyorder: monthlyData[0].total,
                acceptedorder: successorder.length,
                cancleorder: cancleorder.length
            }
            return res.json({status: 200, data: countData})
        } catch (e) {
            console.log(e)
            return res.json({ status: 500, msg: 'internal server error' })
        }
    }

    static restaurantSubcription = async (req, res) => {

        try {
            const aggregation = [
                {
                    $lookup: {
                        from: 'restaurants',
                        localField: 'restaurant_id',
                        foreignField: '_id',
                        as: 'subcription'
                    }
                },
                {
                    $unwind: '$subcription'
                },
                {
                    $project: {
                        name: '$subcription.name',
                        email: '$subcription.email',
                        mobile: '$subcription.mobile',
                        address: '$subcription.address',
                        city: '$subcription.city',
                        restaurant_id: '$subcription._id',
                        _id: 1,
                        start_date: 1,
                        end_date: 1,
                        subcription_running: 1,
                        subcription_accepted_admin: 1
                    }
                },
                {
                    $match: {
                        subcription_running: false,
                        subcription_accepted_admin: 'pending'
                    }
                }
            ]

            const pendingSubcriptions = await subscription.aggregate(aggregation)
            return res.json({status: 200, data: pendingSubcriptions})
        } catch (e) {
            console.log(e)
            return res.json({ status: 500, msg: 'internal server error' })
        }
    }

    static restaurantSubcriptionModify = async (req, res) => {
        try {
            const { restaurant_id, subcription_id, status } = req.query

            if (restaurant_id && subcription_id && status) {

                let query = {
                    _id: subcription_id,
                    restaurant_id: restaurant_id
                },
                update = {
                    $set: {
                        subcription_running: status === 'accepted' ? true : false,
                        subcription_accepted_admin: status
                    }
                },
                options = { new: true }

                const uploadMenu = await subscription.updateOne(query, update, options)
                // console.log(uploadMenu)
                return res.json({status: 200, msg: 'data updated successfully'})

            } else {
                return res.json({ status: 500, msg: 'fill all detail' })
            }

        } catch (e) {
            console.log(e)
            return res.json({ status: 500, msg: 'internal server error' })
        }
    }

    static restaurantStatusTable = async (req, res) => {
        try {
            const aggregation = [
                {
                    $lookup: {
                        from: 'subscriptions',
                        localField: '_id',
                        foreignField: 'restaurant_id',
                        as: 'subcription'
                    }
                }
            ]

            const allData = await restaurant.aggregate(aggregation)

            for (let i = 0; i < allData.length; i++) {
                const element = allData[i];

                element.status = 'inactive'
                for (let j = 0; j < element.subcription.length; j++) {
                    const sub = element.subcription[j];

                    if ((sub.subcription_running === true &&
                        sub.subcription_accepted_admin === 'accepted' &&
                        sub.start_date < currentTime() &&
                        sub.end_date > currentTime())) {
    
                        const diffTime = Math.abs(sub.end_date - new Date);
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
                        if (diffDays > 5) {
                            element.status = 'active'
                        } else {
                            element.status = 'renue'
                        }
                    }
                }

                delete element.restaurant_type
                delete element.subcription
                delete element.__v
                delete element.menu
                delete element.created_date
                delete element.country
                delete element.state
                delete element.restaurent_logo
                delete element.password
            }

            return res.json({status: 200, data: allData})
            
        } catch (e) {
            console.log(e)
            return res.json({ status: 500, msg: 'internal server error' })
        }
    }

    static restaurantGenerateReceiptTable = async (req, res) => {
        try {

            const aggregation = [
                {
                    $lookup: {
                        from: 'restaurants',
                        localField: 'restaurant_id',
                        foreignField: '_id',
                        as: 'subcription'
                    }
                },
                {
                    $unwind: '$subcription'
                },
                {
                    $project: {
                        name: '$subcription.name',
                        email: '$subcription.email',
                        mobile: '$subcription.mobile',
                        address: '$subcription.address',
                        city: '$subcription.city',
                        restaurant_id: '$subcription._id',
                        _id: 1,
                        start_date: 1,
                        end_date: 1,
                        subcription_running: 1,
                        subcription_accepted_admin: 1
                    }
                },
                {
                    $match: {
                        subcription_running: true,
                        subcription_accepted_admin: 'accepted'
                    }
                }
            ]

            const runningSubcriptions = await subscription.aggregate(aggregation)
            return res.json({status: 200, data: runningSubcriptions})
            
        } catch (e) {
            console.log(e)
            return res.json({ status: 500, msg: 'internal server error' })
        }
    }

    static generateReceipt = async (req, res) => {
        try {
            const { restaurant_id } = req.query

            if (restaurant_id) {

                const aggregation = [
                    {
                        $lookup: {
                            from: 'restaurants',
                            localField: 'restaurant_id',
                            foreignField: '_id',
                            as: 'subcription'
                        }
                    },
                    {
                        $unwind: '$subcription'
                    },
                    {
                        $project: {
                            name: '$subcription.name',
                            email: '$subcription.email',
                            mobile: '$subcription.mobile',
                            address: '$subcription.address',
                            restaurant_id: '$subcription._id',
                            _id: 1,
                            price: 1,
                            date: currentTime(),
                            start_date: 1,
                            end_date: 1,
                            subcription_running: 1,
                            subcription_accepted_admin: 1
                        }
                    },
                    {
                        $match: {
                            subcription_running: true,
                            subcription_accepted_admin: 'accepted',
                            restaurant_id: ObjectId(restaurant_id)
                        }
                    }
                ]

                const runningSubcriptions = await subscription.aggregate(aggregation)
                // console.log(runningSubcriptions[0])

                var html = fs.readFileSync('./server/pdf/template.html', 'utf8')
                var options = { format: "A3", orientation: "portrait", border: "10mm" };

                var newpdfName = 'pdf-' + Date.now() + '.pdf';

                var document = {
                    html: html,
                    data: {
                        users: runningSubcriptions[0]
                    },
                    path: './server/pdf/' + newpdfName
                };

                pdf.create(document, options)
                    .then(res => {
                        // console.log(res)
                    })
                    .catch(error => {
                        console.error(error)
                    })

                    var link = 'http://'+req.headers.host+'/pdf/'+newpdfName

                    let data = { 
                        username: runningSubcriptions[0].name,
                        subject: "go-Digital: download your bill",
                        html: `Hi ${runningSubcriptions[0].name} <br /> 
                        Please click on here:<a href="${link}"> Go-digital invoice</a>. <br /><br /> 
                        If you have any query. contact without hasitate<br /> <br />Best Regards,<br />Go-Digital Team`
                    }

                    const sendMail = await mailer('pratikranpariya007@gmail.com', data)
                    console.log(sendMail)

            } else {
                return res.json({ status: 500, msg: 'fill up all detail' })
            }
        } catch (e) {
            console.log(e)
            return res.json({ status: 500, msg: 'internal server error' })
        }
    }

    static createSaleAccount = async (req, res) => {
        try {
            req.body.type = 'sales'
            const savesData = superadmins(req.body)
            const createAcc = await savesData.save()
            return res.json({status: 200, msg: 'created successfully'})
        } catch (e) {
            console.log(e)
            return res.json({ status: 500, msg: 'internal server error' })
        }
    }

}

module.exports = superAdmin;

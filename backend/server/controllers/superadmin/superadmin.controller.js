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
const moment = require('moment')
const { createOtp, verifyOTP } = require('../../utils/otpGenerator')
const FirebaseNotification = require('../../utils/notification')

class superAdmin {

    static login = async (req, res) => {
        try {

           /*  const ff = superadmins({
                 email: 'admin',
                 password: 'admin'
             })

             const fff = await ff.save()

             return */


            const { email, password, fcm } = req.body
            const loginData = await superadmins.findOne({ email, password }, { password: 0, __v: 0 })

            if (loginData) {
                if(fcm){
                let query = { email },
                    update = { $set: { fcm: fcm } },
                    options = { new: true }
                    await superadmins.updateOne(query, update, options)
                }
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

           /* var someDate = currentTime(currentTime().getFullYear() + '-' + (currentTime().getMonth() + 1) + '-' + currentTime().getDate() + ' 00:00:00');
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

            const fireQuery = await savesData.save() */
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
                        status: 1,
                        payment_status: 1
                    }
                },
                {
                    $match: {
                        month: (currentTime().getMonth() + 1),
                        year: currentTime().getFullYear(),
                        restaurant_id: ObjectId(restaurant_id),
                        payment_status: 'success'
                    }
                },
                {
                    $count: 'total'
                }
            ]

            const aggregationData = [
                {
                    $project: {
                        day: {
                            "$dayOfMonth": "$start_time"
                        },
                        month: {
                            "$month": "$start_time"
                        },
                        year: {
                            "$year": "$start_time"
                        },
                        restaurant_id: 1,
                        status: 1,
                        payment_status: 1,
                        order_id: 1
                    }
                },
                {
                    $match: {
                        day: currentTime().getDate(),
                        month: (currentTime().getMonth() + 1),
                        year: currentTime().getFullYear(),
                        restaurant_id: ObjectId(restaurant_id),
                        payment_status: { $in: ['success', 'pending'] }
                    }
                }
            ]

            const monthlyData = await order.aggregate(aggregation)
            
            const allOrder = await order.aggregate(aggregationData)

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
                allorder: cancleorder.length + successorder.length,
                monthlyorder: typeof monthlyData[0] !== 'undefined' ? monthlyData[0].total : 0,
                acceptedorder: successorder.length,
                cancleorder: cancleorder.length
            }

            return res.json({status: 200, data: countData})
        } catch (e) {
            console.log(e)
            return res.json({ status: 500, msg: 'internal server error' })
        }
    }


    static editCoverImage = async (req, res) => {
        try {
            var wh = {}

            if (req.newFile_name[0]) {
                wh['restaurent_cover'] = `http://${req.headers.host}/img/${req.decodedToken._id}/${req.newFile_name[0]}`
            }
            let query = { _id: req.decodedToken._id },
                update = { $set: wh },
                options = { new: true }

            const updateProfile = await restaurant.updateOne(query, update, options)
            return res.json({ status: 200, msg: 'profile updated successfullys' })

        } catch (e) {
            console.log(e);
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
                     // subcription_running: false,
                        subcription_accepted_admin: { $in: ['accepted', 'stopped', 'pending'] }
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
                const fcm = await restaurant.findOne({_id: restaurant_id}, {_id: 0, fcm: 1})
                if(Object.keys(fcm).length){
                    if(status === 'canceled'){
                        await FirebaseNotification(fcm.fcm, 'Your subscription has been canceled')
                    } else if(status === 'accepted'){
                        await FirebaseNotification(fcm.fcm, 'Your subscription has been accepted')
                    }
                }
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
               // delete element.restaurent_logo
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
                            date: new Date(),
                            start_date: 1,
                            end_date: 1,
                            subcription_running: 1,
                            subcription_accepted_admin: 1,
                            subcription_type: 1
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

                for (var i = 0; i < runningSubcriptions.length; i++) {
                    runningSubcriptions[i].date = moment(runningSubcriptions[i].date).format('DD MMMM, YYYY hh:mm A');
                    runningSubcriptions[i].start_date = moment(runningSubcriptions[i].start_date).format('DD MMMM, YYYY hh:mm A');
                    runningSubcriptions[i].end_date = moment(runningSubcriptions[i].end_date).format('DD MMMM, YYYY hh:mm A');
                }

                var html = fs.readFileSync('./server/pdf/bill.html', 'utf8')
                var options = { format: "A2", orientation: "portrait" };

                var newpdfName = 'pdf-' + Date.now() + '.pdf';
                // console.log(newpdfName)

                var document = {
                    html: html,
                    data:  runningSubcriptions[0],
                    path: './server/pdf/' + newpdfName
                };
		    //console.log(document)

               /* pdf.create(document, options)
                    .then(res => {
                        console.log(res)
                    })
                    .catch(error => {
                        console.error(error)
                    })*/

		    const ress = await pdf.create(document, options)

                    console.log(ress);

                    var link = 'http://'+req.headers.host+'/pdf/'+newpdfName
                    // console.log(link)

                    let data = {
                        username: runningSubcriptions[0].name,
                        subject: "go-Digital: download your bill",
                        html: `Hi ${runningSubcriptions[0].name} <br /> 
                        Please click on here:<a href="${link}"> Go-digital invoice</a>. <br /><br /> 
                        If you have any query. contact without hasitate<br /> <br />Best Regards,<br />Go-Digital Team`
                    }
                    const sendMail = await mailer(`${runningSubcriptions[0].email}`, data)
                    return res.json({ status: 200, msg: 'success' })

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

    static graph = async (req, res) => {
        try {
            const {month, year} = req.query

            if(month && year){
                const aggregation = [
                    {
                        $project: {
                            day: {
                                $dayOfMonth: "$start_date"
                            },
                            month: {
                                "$month": "$start_date"
                            },
                            year: {
                                "$year": "$start_date"
                            },
                            price: 1,
                        }
                    },
                    {
                        $match: {
                            month: parseInt(month),
                            year: parseInt(year),
                        }
                    },
                    {
                        $group: { _id: '$day', count: { $sum: '$price' } }
                    }]
    
                const fireQuery = await subscription.aggregate(aggregation)

                const staticData = []
                for (let i = 1; i <= 31; i++) {
                    staticData.push({_id: i,count: 0}) 
                }

                function arr_diff (a1, a2) {
                    var a = [], diff = [];
                    for (var i = 0; i < a1.length; i++) {
                        a[a1[i]._id] = a1[i];
                    }
                    for (var i = 0; i < a2.length; i++) {
                        if (a[a2[i]._id]) {
                            delete a[a2[i]._id];
                        } else {
                            a[a2[i]._id] = a2[i];
                        }
                    }
                    for (var k in a) {
                        diff.push(a);
                    }
                    var filtered = diff[diff.length - 1].filter(function (el) {
                        return el != null;
                      });
                    return filtered;
                }

                const getUniquieData = arr_diff(fireQuery, staticData)
                const montlyData = getUniquieData.concat(fireQuery)
                const getValue = montlyData.sort((a, b) => a._id > b._id ? 1 : -1);

                return res.json({status: 200, data: getValue})
            } else {
                return res.json({status: 500, msg: 'fill all details'})
            }

        } catch (e) {
            console.log(e);
            return res.json({ status: 500, msg: 'internal server error' })
        }
    }

    static restaurantGraph = async (req, res) => {
        try {
            const { restaurant_id } = req.query

            console.log(req.query);

            if(restaurant_id){
                const aggregation = [
                    {
                        $project: {
                            day: {
                                $dayOfMonth: "$start_time"
                            },
                            month: {
                                "$month": "$start_time"
                            },
                            year: {
                                "$year": "$start_time"
                            },
                            totalprice: 1,
                            payment_status: 1,
                            restaurant_id: 1
                        }
                    },
                    {
                        $match: {
                            month: (currentTime().getMonth() + 1),
                            year: currentTime().getFullYear(),
                            payment_status: 'success',
                            restaurant_id: ObjectId(restaurant_id),
                        }
                    },
                    {
                        $group: { _id: '$day', count: { $sum: '$totalprice' } }
                    }]

                const fireQuery = await order.aggregate(aggregation)

                const staticData = []
                for (let i = 1; i <= 31; i++) {
                    staticData.push({_id: i,count: 0})
                }

                function arr_diff (a1, a2) {
                    var a = [], diff = [];
                    for (var i = 0; i < a1.length; i++) {
                        a[a1[i]._id] = a1[i];
                    }
                    for (var i = 0; i < a2.length; i++) {
                        if (a[a2[i]._id]) {
                            delete a[a2[i]._id];
                        } else {
                            a[a2[i]._id] = a2[i];
                        }
                    }
                    for (var k in a) {
                        diff.push(a);
                    }
                    var filtered = diff[diff.length - 1].filter(function (el) {
                        return el != null;
                      });
                    return filtered;
                }

                const getUniquieData = arr_diff(fireQuery, staticData)
                const montlyData = getUniquieData.concat(fireQuery)
                const getValue = montlyData.sort((a, b) => a._id > b._id ? 1 : -1);

                return res.json({status: 200, data: getValue})
            } else {
                return res.json({status: 500, msg: 'fill all details'})
            }

        } catch (e) {
            console.log(e);
            return res.json({ status: 500, msg: 'internal server error' })
        }
    }
    
    static manualySubBuy = async (req, res) => {
        try {
        
/*	const ifAvailable = await subscription.find({restaurant_id: req.body.restoid})

            var runningSub = [], acceptedSub = [], pendingSub = [];
            for (let i = 0; i < ifAvailable.length; i++) {
                const element = ifAvailable[i];

                if (element.subcription_running === true &&
                    element.subcription_accepted_admin === 'accepted' &&
                    element.start_date < currentTime() &&
                    element.end_date > currentTime()) {
                    runningSub.push(element.end_date)
                } else if (element.subcription_running === false &&
                    element.subcription_accepted_admin === 'accepted' &&
                    element.start_date > currentTime()) {
                    acceptedSub.push(element.end_date)
                } else if (element.subcription_running === false &&
                    element.subcription_accepted_admin === 'pending' &&
                    element.start_date > currentTime()) {
                    pendingSub.push(element.end_date)
                }
            }

            var runn = currentTime(currentTime().getFullYear() + '-' + (currentTime().getMonth() + 1) + '-' + currentTime().getDate() + ' 00:00:00')
             if(acceptedSub.length > 0){
                var runn = acceptedSub[acceptedSub.length - 1] ? acceptedSub[acceptedSub.length - 1] : currentTime(currentTime().getFullYear() + '-' + (currentTime().getMonth() + 1) + '-' + currentTime().getDate() + ' 00:00:00')
                var someDate = acceptedSub[acceptedSub.length - 1] ? currentTime(acceptedSub[acceptedSub.length - 1]) : currentTime(currentTime().getFullYear() + '-' + (currentTime().getMonth() + 1) + '-' + currentTime().getDate() + ' 00:00:00')
            } else if (pendingSub.length > 0) {
                var runn = pendingSub[pendingSub.length - 1] ? pendingSub[pendingSub.length - 1] : currentTime(currentTime().getFullYear() + '-' + (currentTime().getMonth() + 1) + '-' + currentTime().getDate() + ' 00:00:00')
                var someDate = pendingSub[pendingSub.length - 1] ? currentTime(pendingSub[pendingSub.length - 1]) : currentTime(currentTime().getFullYear() + '-' + (currentTime().getMonth() + 1) + '-' + currentTime().getDate() + ' 00:00:00')
            } else if (runningSub.length > 0) {
                var runn = runningSub[runningSub.length - 1] ? runningSub[runningSub.length - 1] : currentTime(currentTime().getFullYear() + '-' + (currentTime().getMonth() + 1) + '-' + currentTime().getDate() + ' 00:00:00')
                var someDate = runningSub[runningSub.length - 1] ? currentTime(runningSub[runningSub.length - 1]) : currentTime(currentTime().getFullYear() + '-' + (currentTime().getMonth() + 1) + '-' + currentTime().getDate() + ' 00:00:00')
            }
            var endTime = someDate.setDate(someDate.getDate() + (28 * parseInt(req.body.month)))

            const savesData = subscription({
                start_date: runn,
                end_date: endTime,
                subcription_type: req.body.subcription_type,
                restaurant_id: req.body.restoid,
                payment_type: req.body.payment_type,
                price: 0
            })

            console.log(savesData);

            await savesData.save()
            return res.json({ status: 200, msg: 'subcriptions successfully.' })
*/

		const ifAvailable = await subscription.find({restaurant_id: req.body.restoid})

                 var runningSub = [], pendingSub = [];
            for (let i = 0; i < ifAvailable.length; i++) {
                const element = ifAvailable[i]
                if (element.subcription_running === true &&
                    (element.subcription_accepted_admin === 'accepted' || element.subcription_accepted_admin === 'stopped') &&
                    element.start_date < currentTime() &&
                    element.end_date > currentTime()) {
                    runningSub.push(element.end_date)
                }
                if (element.subcription_running === false &&
                    element.subcription_accepted_admin === 'pending' &&
                    element.start_date < currentTime() &&
                    element.end_date > currentTime()) {
                    pendingSub.push(element.end_date)
                }
            }

            if (runningSub.length > 0) {
                return res.json({ status: 401, msg: 'you do not buy subcription cause of your subcription is running now.' })
            } else if (pendingSub.length > 0) {
                return res.json({ status: 401, msg: 'you do not buy subcription cause of your subcription is pending now.' })
            } else {
		var someDate = currentTime(currentTime().getFullYear() + '-' + (currentTime().getMonth() + 1) + '-' + currentTime().getDate() + ' 00:00:00')
                var endTime = someDate.setDate(someDate.getDate() + (28 * parseInt(req.body.plansize)))
                const savesData = subscription({
                    start_date: currentTime(currentTime().getFullYear() + '-' + (currentTime().getMonth() + 1) + '-' + currentTime().getDate() + ' 00:00:00'),
                    end_date: endTime,
                    subcription_type: req.body.subcription_type,
                    restaurant_id: req.body.restoid,
                    payment_type: req.body.payment_type,
                    price: 0
                })

		    const fcm = await restaurant.findOne({_id: req.body.restoid}, {_id: 0, fcm: 1})
                if(Object.keys(fcm).length){
                    await FirebaseNotification(fcm.fcm, 'Your subscription has been added')
                }

                const fireQuery = await savesData.save()
                return res.json({ status: 200, msg: 'subcriptions successfully.' })
            }



	} catch (e) {
            console.log(e);
            return res.json({ status: 500, msg: 'internal server error' })
        }
    }
   
    static insertFirebaseId = async (req, res) => {
        try {
            let query = { email: req.body.email },
                update = { $set: { firebase_id: req.body.fuid } },
                options = { new: true }

            const updateProfile = await restaurant.updateOne(query, update, options)
            return res.json({ status: 200, msg: 'account created successfully' })
        } catch (e) {
            console.log(e);
            return res.json({ status: 500, msg: 'internal server error' })
        }
    }
 
    static chatfiles = async (req, res) => {
        try {
            return res.json({ status: 200, data: `http://${req.headers.host}/chatFiles/${req.newFile_name[0]}` })
        } catch (e) {
            console.log(e);
            return res.json({ status: 500, msg: 'internal server error' })
        }
    }

        static createOtp = async (req, res) => {
        try {
            const { email } = req.body
            if (email) {
                const ExistEmail = await superadmins.findOne({ email: email })
               console.log(ExistEmail)
		    if (ExistEmail) {
                    const genOtp = await createOtp(email)
                    let data = {
                        username: email,
                        subject: `ScannMenu: ${genOtp} is your one time password`,
                        html: `Hi ${email} <br /> 
                        your one time password <b>${genOtp}</b>. <br /><br /> 
                        If you have any query. contact without hasitate.<br /> <br />Best Regards,<br />ScannMenu Team`
                    }
                    const sendingMail = await mailer(`${ExistEmail.email}`, data)
                    if (sendingMail) {
                        return res.json({ status: 200, data: `opt send successfully in ${email}` })
                    } else {
                        return res.json({ status: 500, msg: 'otp not send please try again' })
                    }
                } else {
                    return res.json({ status: 500, msg: `${email} does not exist` })
                }
            } else {
                return res.json({ status: 500, msg: 'fill all detail' })
            }
        } catch (e) {
            console.log(e);
            return res.json({ status: 500, msg: 'internal server error' })
        }
    }

    static verifyOTP = async (req, res) => {
        try {
            const checkOtp = await verifyOTP(req.body.email, req.body.otp)
            if(checkOtp){
                return res.json({status: 200, data: 'verification success'})
            } else {
                return res.json({ status: 500, msg: 'wrong otp' })
            }
        } catch (e) {
            console.log(e);
            return res.json({ status: 500, msg: 'internal server error' })
        }
    }

    static newPassword = async (req, res) => {
        try {
            const { email, password } = req.body
            if (email && password) {
                let query = { email: email },
                    update = {
                        $set: {
                            password: password
                        }
                    },
                    options = { new: true }
                await superadmins.updateOne(query, update, options)
            return res.json({ status: 200, msg: 'password change successfully' })
            } else {
                return res.json({ status: 500, msg: 'fill all detail' })
            }
        } catch (e) {
            console.log(e);
            return res.json({ status: 500, msg: 'internal server error' })
        }
    }

    static changeSubcriptionStatus = async (req, res) => {
        try {
            const { restaurant_id, subcription_id, status } = req.query

            if (restaurant_id && subcription_id && status) {

                let query = {
                    _id: subcription_id,
                    restaurant_id: restaurant_id
                },
                update = {
                    $set: {
                        subcription_accepted_admin: status
                    }
                },
                options = { new: true }
                                const statusSub = await subscription.findOne({_id: subcription_id})
		const fcm = await restaurant.findOne({_id: restaurant_id}, {_id: 0, fcm: 1})
                    if(Object.keys(fcm).length){
                        if(status === 'stopped'){
                        await FirebaseNotification(fcm.fcm, 'Your subscription is paused')
                    } else if(statusSub.subcription_accepted_admin === 'stopped' && status === 'accepted'){
                        await FirebaseNotification(fcm.fcm, 'Your subscription is resumed')
                    } else if(status === 'canceled'){
                        await FirebaseNotification(fcm.fcm, 'Your subscription has been canceled')
                    } else if(statusSub.subcription_accepted_admin === 'pending' && status === 'accepted'){
                        await FirebaseNotification(fcm.fcm, 'Your subscription has been accepted')
                    }
		    }

                await subscription.updateOne(query, update, options)
                return res.json({status: 200, msg: 'data updated successfully'})

            } else {
                return res.json({ status: 500, msg: 'fill all detail' })
            }
        } catch (e) {
            console.log(e);
            return res.json({ status: 500, msg: 'internal server error' })
        }
    }

    static subcriptionHistory = async (req, res) => {
        try {
            var allSubcriptions = await subscription.find({ restaurant_id: req.query.restaurant_id }, {__v: 0, restaurant_id: 0})

            var subType = [], start, end;
            for (let i = 0; i < allSubcriptions.length; i++) {
                var element = allSubcriptions[i]
                if (element.subcription_running === true &&
                    element.subcription_accepted_admin === 'accepted' &&
                    element.start_date < currentTime() &&
                    element.end_date > currentTime()) {
                        start = moment(new Date(element.start_date)).format('DD/MM/YYYY')
                        end = moment(new Date(element.end_date)).format('DD/MM/YYYY')
                    subType.push({ ...element._doc, action: 'running', start_date: start, end_date: end })
                } else if (element.subcription_running === true &&
                    element.subcription_accepted_admin === 'accepted' &&
                    element.start_date > currentTime()) {
                        start = moment(new Date(element.start_date)).format('DD/MM/YYYY')
                        end = moment(new Date(element.end_date)).format('DD/MM/YYYY')
                        subType.push({ ...element._doc, action: 'accepted', start_date: start, end_date: end })
                } else if (element.subcription_running === false &&
                    element.subcription_accepted_admin === 'pending') {
                        start = moment(new Date(element.start_date)).format('DD/MM/YYYY')
                        end = moment(new Date(element.end_date)).format('DD/MM/YYYY')
                        subType.push({ ...element._doc, action: 'pending', start_date: start, end_date: end })
                } else if (element.subcription_running === false &&
                    element.subcription_accepted_admin === 'canceled') {
                        start = moment(new Date(element.start_date)).format('DD/MM/YYYY')
                        end = moment(new Date(element.end_date)).format('DD/MM/YYYY')
                        subType.push({ ...element._doc, action: 'cancel', start_date: start, end_date: end })
                } else if (element.subcription_running === false &&
                    element.subcription_accepted_admin === 'complated') {
                        start = moment(new Date(element.start_date)).format('DD/MM/YYYY')
                        end = moment(new Date(element.end_date)).format('DD/MM/YYYY')
                        subType.push({ ...element._doc, action: 'complated', start_date: start, end_date: end })
                }  else if (
                    element.subcription_accepted_admin === 'stopped') {
                    start = moment(new Date(element.start_date)).format('DD/MM/YYYY')
                    end = moment(new Date(element.end_date)).format('DD/MM/YYYY')
                    subType.push({ ...element._doc, action: 'stopped', start_date: start, end_date: end })
                }
            }
            return res.json({ status: 200, data: subType })

        } catch (e) {
            console.log(e);
            return res.json({ status: 500, msg: 'internal server error' })
        }
    }

      static profileUpdate = async (req, res) => {
        try {
            const { name } = req.body
            var wh = {}

            if (name) {
                wh['name'] = name
            }
            
            if (req.newFile_name[0]) {
                wh['image'] = `http://${req.headers.host}/img/${req.decodedToken._id}/${req.newFile_name[0]}`
            }
            let query = { _id: req.decodedToken._id },
                update = { $set: wh },
                options = { new: true }

            await superadmins.updateOne(query, update, options)
            return res.json({ status: 200, msg: 'profile updated successfullys' })

        } catch (e) {
            console.log(e);
            return res.json({ status: 500, msg: 'internal server error' })
        }
    }

    static restoProfile = async (req, res) => {
        try {
            var profile = await restaurant.findOne({ _id: req.query._id }, { restaurant_type: 1 })
            return res.json({status: 200, data: profile})
        } catch (e) {
            return res.json({ status: 500, msg: 'internal server error' })
        }
    }

    static editSubcriptionDetails = async (req, res) => {
        try {
            if (req.body.plans === 'dining_table') {

                var tables = []
                for (let i = 0; i < parseInt(req.body.dining); i++) {
                    tables.push({ dining_table_id: i + 1 })
                }
                let query = { _id: req.body._id },
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

                let query = { _id: req.body._id },
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

		return res.json({ status: 200, msg: 'data updated successfullys' })
        } catch (e) {
		console.log(e)
            return res.json({ status: 500, msg: 'internal server error' })
        }
    }
}

module.exports = superAdmin;

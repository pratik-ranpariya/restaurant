const csvToJson = require('csvtojson')
const { ObjectId } = require("mongodb")
const { restaurant } = require("../../models/restaurants")
const { order } = require('../../models/order')
const { imps } = require("../../models/imps")
const { subscription } = require('../../models/subscription')
const fileUpload = require("../../utils/fileupload")
const token = require('../../utils/createToken')
const qrdata = require('../../utils/qrcode')
const { createOtp, verifyOTP } = require('../../utils/otpGenerator')
const mailer = require('../../utils/mailer')
const currentTime = require('../../utils/currentTime')
const moment = require('moment')
const FirebaseNotification = require('../../utils/notification')
const { superadmins } = require('../../models/superadmins')

class restaurants {

    static login = async (req, res) => {
        try {
//		await FirebaseNotification(req.body.fcm ? req.body.fcm : 'b', 'a')
	    //await FirebaseNotification('a', 'b')
            // const ff = restaurant({
            //     name: 'lapinoz',
            //     email: 'lapinoz.surat@gmail.com',
            //     password: '123456'
            // })

            // const fff = await ff.save()

            // console.log('ds')


           /* const { username, password, fcm } = req.body
            const loginData = await restaurant.findOne({ username, password }, { password: 0, __v: 0 })

            if (loginData) {

                const tokenCreate = await token({ name: loginData.name, username: loginData.username, _id: loginData._id.toString() })

                if(fcm){
                let query = { username: username },
                    update = { $set: { fcm: fcm } },
                    options = { new: true }
                    await restaurant.updateOne(query, update, options)
                }

                const data = {
                    name: loginData.name,
	            email: loginData.email,
                    username: loginData.username,
                    _id: loginData._id.toString(),
                    token: tokenCreate,
		    firebase_id: loginData.firebase_id ? loginData.firebase_id : ''
                }

                return res.json({ status: 200, data: data })
            } else {
                return res.json({ status: 500, msg: 'username and password not valid' })
            } */


		const { username, password, fcm } = req.body
            const loginData = await restaurant.findOne({ username, password }, { password: 0, __v: 0 })

            if (loginData) {

                const tokenCreate = await token({ name: loginData.name, username: loginData.username, _id: loginData._id.toString() })

                if(fcm){
                let query = { username: username },
                    update = { $set: { fcm: fcm } },
                    options = { new: true }
                    await restaurant.updateOne(query, update, options)
                }

                const data = {
                    name: loginData.name,
                    email: loginData.email,
                    username: loginData.username,
                    _id: loginData._id.toString(),
                    token: tokenCreate,
                    firebase_id: loginData.firebase_id ? loginData.firebase_id : ''
                }

                return res.json({ status: 200, data: data })
            } else {
                const loginData = await restaurant.findOne({ email: username, password }, { password: 0, __v: 0 })
                if(loginData){
                    const tokenCreate = await token({ name: loginData.name, username: loginData.username, _id: loginData._id.toString() })

                    if(fcm){
                    let query = { username: username },
                        update = { $set: { fcm: fcm } },
                        options = { new: true }
                        await restaurant.updateOne(query, update, options)
                    }

                    const data = {
                        name: loginData.name,
                        email: loginData.email,
                        username: loginData.username,
                        _id: loginData._id.toString(),
                        token: tokenCreate,
                        firebase_id: loginData.firebase_id ? loginData.firebase_id : ''
                    }

                    return res.json({ status: 200, data: data })
                } else {
                    return res.json({ status: 500, msg: 'username and password not valid' })
                }
            }

        } catch (e) {
            console.log(e.message);
            res.status(401).send(e.message);
        }
    }

    static menu = async (req, res) => {
        try {
            // console.log(req.files)
            //const fileUploads = await fileUpload(req, res)
		//console.log(req.newFile_name)
            const recipients = await csvToJson({
                trim: true
            }).fromFile('./server/csv/' + req.newFile_name[0]);
             //console.log(recipients)
    
	    await restaurant.updateOne({_id: req.decodedToken._id}, {csv: req.newFile_name[0]}, { new: true })
            
		let myData = []
            recipients.forEach((recipient, i) => {
                let sizes = recipient.size.split(',')
                let price = recipient.price.split(',')
                let combinedData = []

                sizes.forEach((size, j) => {
                    price.forEach((price, k) => {
                        if (j === k) {
                            combinedData.push({ size, price })
                        }
                    })
                })

                let dataT = {
                    id: recipient.id,
                    name: recipient.name,
                    description: recipient.description,
                    category: recipient.category,
		    type: recipient.type,
                    image: `https://${req.headers.host}/img/${req.decodedToken._id}/${recipient.image}`,
                    item: combinedData,
		   // firebase_id: loginData.firebase_id ? loginData.firebase_id : ''
                }
                myData.push(dataT)
            })

            // console.log(myData)

            let query = { _id: req.decodedToken._id },
                update = { $set: { menu: myData } },
                options = { new: true }

            const uploadMenu = await restaurant.updateMany(query, update, options)
            return res.json({ status: 200, msg: 'uploaded successfully' })
        } catch (e) {
            console.log(e);
            return res.json({ status: 500, msg: 'internal server error' })
        }
    }

    static todayorder = async (req, res) => {
        try {
            // const ff = order({
            //     restaurant_id: '60edb966dce8af09d4c668c7',
            //     totalprice: '1200',
            //     payment: 'google_pay',
            //     dining_table: {
            //         dining_table: true,
            //         diningtable_id: 9
            //     },
            //     item: [{
            //         name: 'pizza',
            //         price: 200,
            //         quentity: 2
            //     },{
            //         name: 'dhosa',
            //         price: 400,
            //         quentity: 2
            //     }]
            // })
            // const fff = await ff.save() 
            // return

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
                        restaurant_id: 1,
                        status: 1,
                        payment_status: 1
                    }
                },
                {
                    $match: {
                        day: currentTime().getDate(),
                        month: (currentTime().getMonth() + 1),
                        year: currentTime().getFullYear(),
                        restaurant_id: ObjectId(req.decodedToken._id),
                        payment_status: {$in: ['success', 'pending']}
                    }
                },
            ]
            const countData = await order.aggregate(aggregation)

            var delevered = [], pending = [], canceled = [], inprogress = []

            for (let i = 0; i < countData.length; i++) {
                const element = countData[i];
                if (element.status === 'success') {
                    delevered.push(element.status)
                }
                if (element.status === 'pending') {
                    pending.push(element.status)
                }
                if (element.status === 'cancel') {
                    canceled.push(element.status)
                }
		if (element.status === 'inprogress') {
                    inprogress.push(element.status)
                }
            }

            var dayData = {
                delevered: delevered.length,
                pending: pending.length,
                cancel: canceled.length,
                inprogress: inprogress.length
            }

            return res.json({ status: 200, data: dayData })

        } catch (e) {
            console.log(e);
            return res.json({ status: 500, msg: 'internal server error' })
        }
    }

    static changeOrderStatus = async (req, res) => {
        try {

            let query = {
                restaurant_id: req.decodedToken._id,
                order_id: {
                    $in: req.body.order_id
                }
            }

            if (req.body.orderStatus === 'success') {
                var update = { $set: { status: req.body.orderStatus, end_time: currentTime() } }
            } else {
                var update = { $set: { status: req.body.orderStatus } }
            }

            let options = { new: true }

            const uploadMenu = await order.updateMany(query, update, options)
            return res.json({ status: 200, msg: 'order status changed successfully' })

        } catch (e) {
            console.log(e);
            return res.json({ status: 500, msg: 'internal server error' })
        }
    }

    static todayOrderDetails = async (req, res) => {
        try {

            // var i = new Date(currentTime().getFullYear() + '-' + (currentTime().getMonth()+1)  + '-' + currentTime().getDate() + ' 00:00:00')

            if (req.query.status === 'all') {
                req.query.status = ["success", "inprogress", "pending", "cancel"]
            } else {
                req.query.status = [`${req.query.status}`]
            }

            let dateWise = currentTime(req.query.date)


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
                        restaurant_id: 1,
                        status: 1,
                        order_id: 1,
                        start_time: 1,
                        end_time: 1,
                        totalprice: 1,
			desc: 1,
                        payment_status: 1,
                        item: 1,
		        type: 1
                    }
                },
                {
                    $match: {
                        day: dateWise.getDate(),
                        month: (dateWise.getMonth() + 1),
                        year: dateWise.getFullYear(),
                        restaurant_id: ObjectId(req.decodedToken._id),
                        status: { $in: req.query.status },
                        payment_status: { $in: ['success', 'pending'] }
                    }
                },
                {
                    $sort: {
                        _id: -1
                    }
                }
            ]

            const countData = await order.aggregate(aggregation)

            for (let i = 0; i < countData.length; i++) {
                countData[i].start_time = moment(new Date(countData[i].start_time)).format('h:mm A')
            }
            return res.json({ status: 200, data: countData })

        } catch (e) {
            console.log(e);
            return res.json({ status: 500, msg: 'internal server error' })
        }
    }

    static allOrders = async (req, res) => {
        try {

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
                        restaurant_id: 1,
                        status: 1,
                        order_id: 1,
                        start_time: 1,
                        end_time: 1,
                        totalprice: 1,
                        payment_status: 1,
                        item: 1,
                        type: 1,
                        _id: 1
                    }
                }, 
                {
                    $match: {
                        restaurant_id: ObjectId(req.decodedToken._id),
                        payment_status: { $in: ['success', 'pending'] }
                    }
                }, 
                {
                    $sort: {
                        _id: -1
                    }
                }]

            const allorders = await order.aggregate(aggregation)
            var orders = [];
            for (let i = 0; i < allorders.length; i++) {

                var orderType = allorders[i].type.type === 'take_away' ? 'take away' : 
                allorders[i].type.type === 'dining_table' ? `Table Number: ${allorders[i].type.table_number}` : 
                allorders[i].type.type === 'hotel' ? `Room Number: ${allorders[i].type.table_number}` : ''

                var orderStatus = allorders[i].status === 'pending' ? 'New Order' :
                allorders[i].status === 'success' ? 'Delivered' :
                allorders[i].status === 'inprogress' ? 'On Delivery' :
                allorders[i].status === 'cancel' ? 'Cancel' : ''

                var products = []
                for (let k = 0; k < allorders[i].item.length; k++) {
                    const element = allorders[i].item[k];
                    products.push(`${element.name} (${element.size}, ${element.quentity}x)`)
                }

                orders.push({
                    orderId: allorders[i].order_id,
                    date: moment(new Date(allorders[i].start_time)).format('DD MMMM YYYY h:mm A'),
                    products: products.toString(),
                    amount: allorders[i].totalprice,
                    types: orderType,
                    orderStatus: orderStatus,
                    payment: allorders[i].payment_status
                })
            }
            
            return res.json({ status: 200, data: orders })
        } catch (e) {
            console.log(e);
            return res.json({ status: 500, msg: 'internal server error' })
        }
    }

    static createDiningTableQrcode = async (req, res) => {
        try {
            //console.log(req.params)
            var tables = []
            for (let i = 0; i < parseInt(req.params.count); i++) {
                tables.push({ dining_table_id: i + 1 })
            }

            let query = { _id: req.decodedToken._id },
                update = { $set: { "restaurant_type.dining_table": tables } },
                options = { new: true }

            const uploadMenu = await restaurant.updateOne(query, update, options)
            return res.json({ status: 200, msg: 'dyning table updated successfully' })

        } catch (e) {
            console.log(e);
            return res.json({ status: 500, msg: 'internal server error' })
        }
    }

    static profileUpdate = async (req, res) => {
        try {

            /*const restaurent_logo_upload = await fileUpload(req, res); */
	    const { name, email, mobile, address, city, state, country, zip, about } = req.body
            var wh = {}
            if (name) {
                wh['name'] = name
            }
            if(email){
                wh['email'] = email
            }
            if(mobile){
                wh['mobile'] = mobile
            }
            if(address){
                wh['address'] = address
            }
            if(city){
                wh['city'] = city
            }
            if(state){
                wh['state'] = state
            }
            if(country){
                wh['country'] = country
            }
            if(zip){
                wh['zip'] = zip
            }
	    if(about){
                wh['about'] = about
            }
            if (req.newFile_name[0]) {
                wh['restaurent_logo'] = `https://${req.headers.host}/img/${req.decodedToken._id}/${req.newFile_name[0]}`
            }

            let query = { _id: req.decodedToken._id },
                update = { $set: wh },
                options = { new: true }

            const updateProfile = await restaurant.updateOne(query, update, options)
            return res.json({ status: 200, msg: 'profile updated successfully' })

        } catch (e) {
            console.log(e);
            return res.json({ status: 500, msg: 'internal server error' })
        }
    }

    static imps = async (req, res) => {
        try {

            const ifExist = await imps.findOne({ restaurant_id: req.decodedToken._id })

            if (ifExist) {
                var wh = {}

                if (req.body.paytm) {
                    wh['paytm'] = req.body.paytm
                }
                if (req.body.phonepe) {
                    wh['phonepe'] = req.body.phonepe
                }
                if (req.body.googlepay) {
                    wh['googlepay'] = req.body.googlepay
                }

                wh.last_updated = currentTime()

                let query = { restaurant_id: req.decodedToken._id },
                    update = { $set: wh },
                    options = { new: true }

                const updateProfile = await imps.updateOne(query, update, options)

            } else {

                req.body.restaurant_id = req.decodedToken._id
                const saveData = imps(req.body)

                const saves = await saveData.save()
            }

            return res.json({ status: 200, msg: 'data updated successfully' })

        } catch (e) {
            console.log(e);
            return res.json({ status: 500, msg: 'internal server error' })
        }
    }

    static newOrder = async (req, res) => {
        try {

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
                        restaurant_id: 1,
                        status: 1,
                        order_id: 1,
                        start_time: 1,
                        end_time: 1,
                        totalprice: 1,
			item: 1,
                        payment_status: 1,
			type: 1
                    }
                },
                {
                    $match: {
                        day: currentTime().getDate(),
                        month: (currentTime().getMonth() + 1),
                        year: currentTime().getFullYear(),
                        restaurant_id: ObjectId(req.decodedToken._id),
                        status: 'pending',
                        payment_status: { $in: ['success', 'pending'] }
                    }
                },
                {
                    $sort: {
                        _id: -1
                    }
                }
            ]

            const countData = await order.aggregate(aggregation)
            return res.json({ status: 200, data: countData })

        } catch (e) {
            console.log(e);
            return res.json({ status: 500, msg: 'internal server error' })
        }
    }

    static subcription = async (req, res) => {
        try {

            // var wh = {}

            // wh['$and'] = [{
            //     start_date: {
            //         $gte: new Date(currentTime().getFullYear() + '-' + (currentTime().getMonth() + 1) + '-' + currentTime().getDate() + ' 00:00:00')
            //     }
            // },
            // {
            //     subcription_running: false
            // },
            // {
            //     subcription_accepted_admin: 'pending'
            // }]

            const ifAvailable = await subscription.find({restaurant_id: req.decodedToken._id})

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

            //if (pendingSub.length >= 1) {
		if(runningSub.length > 0){
               return res.json({ status: 401, msg: 'you do not buy subcription cause of your subcription is running now.' })
			//return res.json({ status: 500, msg: 'purchase only one subcription' })
            } else if (pendingSub.length > 0) {
                return res.json({ status: 401, msg: 'you do not buy subcription cause of your subcription is pending now.' })
            } else if (runningSub) {
                var someDate = runningSub[runningSub.length - 1] ? currentTime(runningSub[runningSub.length - 1]) : currentTime(currentTime().getFullYear() + '-' + (currentTime().getMonth() + 1) + '-' + currentTime().getDate() + ' 00:00:00')
            }

            var endTime = someDate.setDate(someDate.getDate() + (28 * parseInt(req.body.month)))

            const savesData = subscription({
                start_date: runningSub[runningSub.length - 1] ? runningSub[runningSub.length - 1] : currentTime(currentTime().getFullYear() + '-' + (currentTime().getMonth() + 1) + '-' + currentTime().getDate() + ' 00:00:00'),
                end_date: endTime,
                subcription_type: req.body.subcription_type,
                restaurant_id: req.decodedToken._id,
                price: req.body.price
            })

	    const sendNotify = await superadmins.find()
            sendNotify.forEach(async (data) => {
		    if(data.fcm != undefined){
                await FirebaseNotification(data.fcm,`${data.name} has added new Subcription`)
		}
            })

            const fireQuery = await savesData.save()
            return res.json({ status: 200, msg: 'subcriptions successfully.' })

        } catch (e) {
            console.log(e);
            return res.json({ status: 500, msg: 'internal server error' })
        }
    }

    static uploadImage = async (req, res) => {
        try {

            //const imageuploads = await fileUpload(req, res);

            return res.json({ status: 200, msg: 'https://'+req.headers.host + '/img/' + req.decodedToken._id + '/' + req.newFile_name[0] })

        } catch (e) {
            console.log(e);
            return res.json({ status: 500, msg: 'internal server error' })
        }
    }

    static qrGenerator = async (req, res) => {
        try {
            const query = {
                _id: req.decodedToken._id
            }
            const queryFire = await restaurant.findOne(query)
            const restaurantlink = `https://scannmenu.com/?restaurant_id=${req.decodedToken._id}`
            // console.log(restaurantlink)
            const tablearray = []
            for (let i = 0; i < queryFire.restaurant_type.dining_table.length; i++) {
                const element = queryFire.restaurant_type.dining_table[i];
                const dininglink = `https://scannmenu.com/?restaurant_id=${req.decodedToken._id}&dining_number=${element.dining_table_id}`
                const serveData = {
                    dining_table: element.dining_table_id,
                    dining_table_qrcode: await qrdata(dininglink)
                }
                tablearray.push(serveData)
            }

            const roomarray = []
            for (let i = 0; i < queryFire.restaurant_type.rooms.length; i++) {
                const element = queryFire.restaurant_type.rooms[i];
                const dininglink = `https://scannmenu.com/?restaurant_id=${req.decodedToken._id}&room_number=${element.room_id}`
                const serveData = {
                    room_number: element.room_id,
                    room_qrcode: await qrdata(dininglink)
                }
                roomarray.push(serveData)
            }

            var allqrcodes = {
                restaurant: await qrdata(restaurantlink),
                dining_table: tablearray,
                rooms: roomarray
            }
            return res.json({ status: 200, data: allqrcodes })
        } catch (e) {
            console.log(e);
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
                            month: parseInt(month),
                            year: parseInt(year),
                            payment_status: 'success',
                            restaurant_id: ObjectId(req.decodedToken._id),
                        }
                    },
                    {
                        $group: { _id: '$day', count: { $sum: '$totalprice' } }
                    }]

                    // console.log(aggregation[1].$match);
    
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

    static createOtp = async (req, res) => {
        try {
            const { email } = req.body
            if (email) {
                const ExistEmail = await restaurant.findOne({ email: email })
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
                await restaurant.updateOne(query, update, options)
            return res.json({ status: 200, msg: 'password change successfully' })
            } else {
                return res.json({ status: 500, msg: 'fill all detail' })
            }
        } catch (e) {
            console.log(e);
            return res.json({ status: 500, msg: 'internal server error' })
        }
    }

    static todayCancleOrder = async (req, res) => {
        try {
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
                        restaurant_id: 1,
                        status: 1,
                        order_id: 1,
                        start_time: 1,
                        end_time: 1,
                        totalprice: 1,
                        item: 1,
                        payment_status: 1
                    }
                },
                {
                    $match: {
                        day: currentTime().getDate(),
                        month: (currentTime().getMonth() + 1),
                        year: currentTime().getFullYear(),
                        restaurant_id: ObjectId(req.decodedToken._id),
                        status: 'cancel',
                        payment_status: { $in: ['success', 'pending'] }
                    }
                },
                {
                    $project: {
                        restaurant_id: 1,
                        status: 1,
                        order_id: 1,
                        start_time: 1,
                        end_time: 1,
                        totalprice: 1,
                        item: 1,
                        payment_status: 1
                    }
                },
                {
                    $sort: {
                        _id: -1
                    }
                }
            ]

            const countData = await order.aggregate(aggregation)
            return res.json({ status: 200, data: countData })
            
        } catch (e) {
            console.log(e);
            return res.json({ status: 500, msg: 'internal server error' })
        }
    }

    static changePaymentStatus = async(req, res) => {
        try {
            let query = {
                restaurant_id: req.decodedToken._id,
                order_id: req.body.order_id
            },
            update = { $set: { payment_status: req.body.paymentStatus } },
            options = { new: true }

            const uploadMenu = await order.updateMany(query, update, options)
            return res.json({ status: 200, msg: 'order status changed successfully' })
        } catch (e) {
            console.log(e);
            return res.json({ status: 500, msg: 'internal server error' })
        }
    }

    static subcriptionHistory = async (req, res) => {
        try {
            var allSubcriptions = await subscription.find({ restaurant_id: req.decodedToken._id }, {__v: 0, restaurant_id: 0})

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
     
    static profile = async (req, res) => {
        try {
            var profile = await restaurant.findOne({ _id: req.decodedToken._id }, {zip: 1, state: 1, username: 1, csv: 1, restaurent_cover: 1, restaurent_logo: 1, city: 1, about: 1, name: 1, email: 1, mobile: 1, address: 1, restaurant_type: 1})

            var profileData = {
		  state: profile.state,
		  zip: profile.zip,
		  restaurent_logo: profile.restaurent_logo,
                  type: profile.restaurant_type.restaurant_type,
                  table: profile.restaurant_type.dining_table.length,
                  room: profile.restaurant_type.rooms.length,
                  name: profile.name,
                  email: profile.email,
                  mobile: profile.mobile,
                  _id: profile._id,
                  address: profile.address,
		  about: profile.about ? profile.about : '',
		  city: profile.city,
		  restaurent_cover: profile.restaurent_cover ? profile.restaurent_cover : '',
                  csv: profile.csv ? profile.csv : '',
		  username: profile.username
            }
            return res.json({status: 200, data: profileData})
        } catch (e) {
            return res.json({ status: 500, msg: 'internal server error' })
        }
    }

    static updateUpi = async (req, res) => {
        try {

            const ifAvailable = await imps.findOne({restaurant_id: req.decodedToken._id})
            if(ifAvailable){
                req.body.last_updated = new Date()

            let query = { restaurant_id: req.decodedToken._id },
                update = { $set: req.body },
                options = { new: true }

                console.log(req.body);

            const updateProfile = await imps.updateOne(query, update, options)
            console.log(updateProfile);
            return res.json({ status: 200, msg: 'data has been updated successfully' })
        } else {
            req.body.restaurant_id = req.decodedToken._id
            const insertUPI = await imps(req.body).save()
            return res.json({ status: 200, msg: 'data inserted successfully' })
        }
        } catch (e) {
            console.log(e);
            return res.json({ status: 500, msg: 'internal server error' })
        }
    }

    static editCoverImage = async (req, res) => {
        try {
            var wh = {}
            console.log('----')
            if (req.newFile_name[0]) {
                wh['restaurent_cover'] = `https://${req.headers.host}/img/${req.decodedToken._id}/${req.newFile_name[0]}`
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

    static restaurantStatus = async (req, res) => {
        try {
            const aggregation = [
                {
                    $lookup: {
                        from: 'subscriptions',
                        localField: '_id',
                        foreignField: 'restaurant_id',
                        as: 'subcription'
                    }
                },
                {
                    $project: {
                        subcription: 1
                    }
                },
                {
                    $match: {
                        _id: ObjectId(req.decodedToken._id)
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
                delete element.subcription
            }
            return res.json({status: 200, data: allData[0]})
        } catch (e) {
            console.log(e)
            return res.json({ status: 500, msg: 'internal server error' })
        }
    }
}

module.exports = restaurants;

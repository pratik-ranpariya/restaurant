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

class restaurants {

    static login = async (req, res) => {
        try {

            // const ff = restaurant({
            //     name: 'lapinoz',
            //     email: 'lapinoz.surat@gmail.com',
            //     password: '123456'
            // })

            // const fff = await ff.save()

            // console.log('ds')


            const { email, password } = req.body
            const loginData = await restaurant.findOne({ email, password }, { password: 0, __v: 0 })

            if (loginData) {

                const tokenCreate = await token({ name: loginData.name, email: loginData.email, _id: loginData._id.toString() })

                const data = {
                    name: loginData.name,
                    email: loginData.email,
                    _id: loginData._id.toString(),
                    token: tokenCreate
                }

                return res.json({ status: 200, data: data })

            } else {
                return res.json({ status: 500, msg: 'email and password not valid' })
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
                    image: recipient.image,
                    item: combinedData
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
                        status: 1
                    }
                },
                {
                    $match: {
                        day: currentTime().getDate(),
                        month: (currentTime().getMonth() + 1),
                        year: currentTime().getFullYear(),
                        restaurant_id: ObjectId(req.decodedToken._id)
                    }
                },
            ]

            const countData = await order.aggregate(aggregation)

            var delevered = [], pending = [], canceled = []

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
            }

            var dayData = {
                delevered: delevered.length,
                pending: pending.length,
                cancel: canceled.length
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
                        totalprice: 1
                    }
                },
                {
                    $match: {
                        day: dateWise.getDate(),
                        month: (dateWise.getMonth() + 1),
                        year: dateWise.getFullYear(),
                        restaurant_id: ObjectId(req.decodedToken._id),
                        status: { $in: req.query.status }
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

            const restaurent_logo_upload = await fileUpload(req, res);

            var wh = {}
            if (req.body.name) {
                wh['name'] = req.body.name
            }
            if (req.files) {
                wh['restaurent_logo'] = req.newFile_name[0]
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
                        totalprice: 1
                    }
                },
                {
                    $match: {
                        day: currentTime().getDate(),
                        month: (currentTime().getMonth() + 1),
                        year: currentTime().getFullYear(),
                        restaurant_id: ObjectId(req.decodedToken._id),
                        status: 'pending'
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

            var wh = {}

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

            const ifAvailable = await subscription.find()

            var runningSub = [], pendingSub = [];
            for (let i = 0; i < ifAvailable.length; i++) {
                const element = ifAvailable[i];

                if (element.subcription_running === true &&
                    element.subcription_accepted_admin === 'accepted' &&
                    element.start_date < currentTime() &&
                    element.end_date > currentTime()) {
                    runningSub.push(element.end_date)
                } else if (element.subcription_running === false &&
                    element.subcription_accepted_admin === 'pending' &&
                    element.start_date > currentTime()) {
                    pendingSub.push(element.end_date)
                }
            }

            if (pendingSub.length >= 1) {
                return res.json({ status: 500, msg: 'purchase only one subcription' })
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

            return res.json({ status: 200, data: req.headers.host + '/img/' + req.newFile_name[0] })

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
            const restaurantlink = `http://scannmenu.com:3002/?restaurant_id=${req.decodedToken._id}`
            console.log(restaurantlink)
            const tablearray = []
            for (let i = 0; i < queryFire.restaurant_type.dining_table.length; i++) {
                const element = queryFire.restaurant_type.dining_table[i];
                const dininglink = `http://scannmenu.com:3002/?restaurant_id=${req.decodedToken._id}&dining_number=${element.dining_table_id}`
                const serveData = {
                    dining_table: element.dining_table_id,
                    dining_table_qrcode: await qrdata(dininglink)
                }
                tablearray.push(serveData)
            }

            const roomarray = []
            for (let i = 0; i < queryFire.restaurant_type.rooms.length; i++) {
                const element = queryFire.restaurant_type.rooms[i];
                const dininglink = `http://scannmenu.com:3002/?restaurant_id=${req.decodedToken._id}&room_number=${element.room_id}`
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
                            totalprice: 1
                        }
                    },
                    {
                        $match: {
                            month: parseInt(month),
                            year: parseInt(year),
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

    static createOtp = async (req, res) => {
        try {
            const { email } = req.body
            if (email) {
                const ExistEmail = await restaurant.findOne({ email: email })
                if (ExistEmail) {
                    const genOtp = await createOtp(email)
                    let data = {
                        username: email,
                        subject: `go-Digital: ${genOtp} is your one time password`,
                        html: `Hi ${email} <br /> 
                        your one time password <b>${genOtp}</b>. <br /><br /> 
                        If you have any query. contact without hasitate.<br /> <br />Best Regards,<br />Go-Digital Team`
                    }
                    const sendingMail = await mailer('pratikranpariya007@gmail.com', data)
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
                const uploadMenu = await subscription.updateOne(query, update, options)
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
                        item: 1
                    }
                },
                {
                    $match: {
                        day: currentTime().getDate(),
                        month: (currentTime().getMonth() + 1),
                        year: currentTime().getFullYear(),
                        restaurant_id: ObjectId(req.decodedToken._id),
                        status: 'cancel'
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
                        item: 1
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

}

module.exports = restaurants;

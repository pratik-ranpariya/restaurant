const express = require('express');
const router = express.Router();
const checkAuth = require('../middlewares/auth');
const restaurants = require('../controllers/restaurants/restaurant.controller')
const superAdmin = require('../controllers/superadmin/superadmin.controller')
const user = require('../controllers/user/user.controller')
const ifsubcriptions = require('../middlewares/existsubcriptions')
const chatfileupload = require('../middlewares/chatfileupload')
const fileupload = require('../middlewares/fileuploads')
const paytm = require('../controllers/restaurants/paytm.payment')
const rozarpay = require('../controllers/restaurants/rozarpay.payment')
const cache = require('../utils/cache')

const parseUrl = express.urlencoded({ extended: false });
const parseJson = express.json({ extended: false });

//restaurant api
router.route('/restaurants/login').post(restaurants.login)
router.route('/restaurants/menu').post(checkAuth, fileupload, restaurants.menu)
router.route('/restaurants/todayorder').get(checkAuth, restaurants.todayorder)
router.route('/restaurants/change_order_status').post(checkAuth, restaurants.changeOrderStatus)
router.route('/restaurants/today_order_details').get(checkAuth, restaurants.todayOrderDetails)
router.route('/restaurants/create_dining_table_qrcode/:count').get(checkAuth, restaurants.createDiningTableQrcode)
router.route('/restaurants/profile_update').post(checkAuth, fileupload, restaurants.profileUpdate)
router.route('/restaurants/imps').post(checkAuth, restaurants.imps)
router.route('/restaurants/neworder').get(checkAuth, restaurants.newOrder)
router.route('/restaurants/subcription').post(checkAuth, restaurants.subcription)
router.route('/restaurants/image_upload').post(checkAuth, fileupload, restaurants.uploadImage)
router.route('/restaurants/all_qrcode').get(checkAuth, restaurants.qrGenerator)
router.route('/restaurants/graph').get(checkAuth, restaurants.graph)
router.route('/restaurants/forgotpassword').post(restaurants.createOtp)
router.route('/restaurants/verifyotp').post(restaurants.verifyOTP)
router.route('/restaurants/newpassword').post(restaurants.newPassword)
router.route('/restaurants/todaycancleorders').get(checkAuth, restaurants.todayCancleOrder)
router.route('/restaurants/razorpay').post(checkAuth, rozarpay.rozarpay)
router.route('/restaurants/change_payment_status').post(checkAuth, restaurants.changePaymentStatus)
router.route('/restaurants/subcription_history').get(checkAuth, restaurants.subcriptionHistory)
router.route('/restaurants/profile').get(checkAuth, restaurants.profile)
router.route('/restaurants/updateupi').post(checkAuth, restaurants.updateUpi)
router.route('/restaurants/allorders').post(checkAuth, restaurants.allOrders)
router.route('/restaurants/editcoverimage').post(checkAuth, fileupload, restaurants.editCoverImage)
router.route('/restaurants/restaurantstatus').get(checkAuth, restaurants.restaurantStatus)

//superadmin api
router.route('/superadmin/login').post(superAdmin.login)
router.route('/superadmin/dashboardCount').get(checkAuth, superAdmin.dashboard)
router.route('/superadmin/create_rest_account').post(checkAuth, superAdmin.createRestAccount)
router.route('/superadmin/restaurants_table').get(checkAuth, superAdmin.restaurantsTable)
router.route('/superadmin/rastaurent_detail').get(checkAuth, superAdmin.rastaurentDetail)
router.route('/superadmin/restaurant_subcription').get(checkAuth, superAdmin.restaurantSubcription)
router.route('/superadmin/restaurant_subcription_modify').get(checkAuth, superAdmin.restaurantSubcriptionModify)
router.route('/superadmin/restaurant_status_table').get(checkAuth, superAdmin.restaurantStatusTable)
router.route('/superadmin/restaurant_generate_receipt_table').get(checkAuth, superAdmin.restaurantGenerateReceiptTable)
router.route('/superadmin/generate_receipt').get(checkAuth, superAdmin.generateReceipt)
router.route('/superadmin/salesacoount').post(checkAuth, superAdmin.createSaleAccount)
router.route('/superadmin/graph').get(checkAuth, superAdmin.graph)
router.route('/superadmin/rastaurent_graph').get(checkAuth, superAdmin.restaurantGraph)
router.route('/superadmin/manualy_sub_buy').post(checkAuth, superAdmin.manualySubBuy)
router.route('/superadmin/insert_firebase_id').post(checkAuth, superAdmin.insertFirebaseId)
router.route('/superadmin/chatFileupload').post( chatfileupload, superAdmin.chatfiles)
router.route('/superadmin/forgotpassword').post(superAdmin.createOtp)
router.route('/superadmin/verifyotp').post(superAdmin.verifyOTP)
router.route('/superadmin/newpassword').post(superAdmin.newPassword)
router.route('/superadmin/change_subcription_status').get(superAdmin.changeSubcriptionStatus)
router.route('/superadmin/subcription_history').get(checkAuth, superAdmin.subcriptionHistory)
router.route('/superadmin/profile').get(checkAuth, superAdmin.restoProfile)
router.route('/superadmin/editsubcriptiondetails').post(checkAuth, superAdmin.editSubcriptionDetails)

//user api
router.route('/users/restaurant_menu').get(ifsubcriptions, user.restaurantMenu)
router.route('/users/order').post(user.order)
router.route('/users/checkorders').get(user.checkOrder)
router.route('/users/getupi').get(user.getUpi)
router.route('/users/paytm').post([parseUrl, parseJson], paytm.make_payment)
router.route('/users/paytm/callback').post(paytm.callback)
router.route('/onebelion').get(user.forloop)


module.exports = router;


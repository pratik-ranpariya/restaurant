const express = require("express");
const opn = require('opn');
const https = require("https");
const qs = require("querystring");
const formidable = require('formidable')
const checksum_lib = require("../../utils/checksum");
const { imps } = require('../../models/imps')
const { order } = require('../../models/order')
const app = express();



class paytm {
    static make_payment = async (req, res) => {

        if (!req.body.order_id || !req.body.totalprice) {
            res.status(400).send('Payment failed')
        } else {
	    const mycred = await imps.findOne({restaurant_id: req.body.restaurant_id})

            // mid: "MNezKY16526580805203",
            // key: "bDunc9kI3MxiujAT",
            // website: "WEBSTAGING",

            var params = {};
            params['MID'] = mycred.paytm_merchant_id;
            params['WEBSITE'] = 'WEBSTAGING';
            params['CHANNEL_ID'] = 'WEB';
            params['INDUSTRY_TYPE_ID'] = 'Retail';
            params['ORDER_ID'] = `${req.body.order_id}`;
            params['CUST_ID'] = 'restaurant';
            params['TXN_AMOUNT'] = JSON.stringify(req.body.totalprice);
            params['CALLBACK_URL'] = 'https://app.scannmenu.com/users/paytm/callback';


            checksum_lib.genchecksum(params, mycred.paytm_merchant_key, function (err, checksum) {
                let paytmParams = {
                    ...params,
                    "CHECKSUMHASH": checksum
                }
                return res.json(paytmParams)
            });
        }
    }

    static callback = (req, res) => {
        // console.log(req.body)
        if (req.body.STATUS === "TXN_SUCCESS") {
            //res.send("tranection success")
	//	opn('https://scannmenu.com/myorders')
          res.redirect(`https://scannmenu.com/myorders`)
		let query = { order_id: req.body.ORDERID },
                update = { $set: { payment_status: 'success' } },
                options = { new: true }

            // console.log(query);

            order.updateOne(query, update, options)
                .then((ifsuccess) => {
                    console.log(ifsuccess, '----success');
                })
                .catch((e) => {
                    console.log(e, '-----payment successs but database error');
                })
        } else {
            //res.send("tranection failed")
            res.redirect(`https://scannmenu.com`)
        }
    }

    // static callback = (req, res) => {
    //     console.log(req.body,'------');

    //     const form = new formidable.IncomingForm();

    //     form.parse(req, (err, fields, file) => {


    //         var paytmChecksum = fields.CHECKSUMHASH;
    //         delete fields.CHECKSUMHASH;

    //         var isVerifySignature = checksum_lib.verifychecksum(fields, 'bDunc9kI3MxiujAT', paytmChecksum);
    //         console.log(isVerifySignature);
    //         if (isVerifySignature) {


    //             var paytmParams = {};
    //             paytmParams["MID"] = fields.MID;
    //             paytmParams["ORDER_ID"] = fields.ORDER_ID;


    //             checksum_lib.genchecksum(paytmParams, 'bDunc9kI3MxiujAT').then(function (checksum) {

    //                 paytmParams["CHECKSUMHASH"] = checksum;

    //                 console.log(paytmParams["CHECKSUMHASH"]);

    //                 var post_data = JSON.stringify(paytmParams);

    //                 var options = {

    //                     /* for Staging */
    //                     hostname: 'securegw-stage.paytm.in',

    //                     /* for Production */
    //                     // hostname: 'securegw.paytm.in',

    //                     port: 443,
    //                     path: '/order/status',
    //                     method: 'POST',
    //                     headers: {
    //                         'Content-Type': 'application/json',
    //                         'Content-Length': post_data.length
    //                     }
    //                 };

    //                 var response = "";
    //                 var post_req = https.request(options, function (post_res) {
    //                     post_res.on('data', function (chunk) {
    //                         response += chunk;
    //                     });

    //                     post_res.on('end', function () {
    //                         let result = JSON.parse(response)
    //                         if (result.STATUS === 'TXN_SUCCESS') {
    //                             //store in db
    //                             console.log('----success transection');
    //                         }

    //                         res.redirect(`http://localhost:3000/status/${result.ORDERID}`)


    //                     });
    //                 });

    //                 post_req.write(post_data);
    //                 post_req.end();
    //             });


    //         } else {
    //             console.log("Checksum Mismatched");
    //         }

    //     })
    // }


    // static callback = (req, res) => {

    //     var body = '';

    //     req.on('data', function (data) {
    //         body += data;
    //     });

    //     console.log(body, '1-1-1-1-1--1');

    //     // req.on('end', function () {
    //         // var html = "";
    //         var post_data = req.body;

    //         // console.log(post_data);

    //         // received params in callback
    //         // console.log('Callback Response: ', post_data, "\n");


    //         // verify the checksum
    //         var checksumhash = post_data.CHECKSUMHASH;
    //         // delete post_data.CHECKSUMHASH;
    //         var result = checksum_lib.verifychecksum(post_data, 'bDunc9kI3MxiujAT', checksumhash);
    //         // console.log("Checksum Result => ", result, "\n");


    //         // Send Server-to-Server request to verify Order Status
    //         var params = { "MID": 'MNezKY16526580805203', "ORDER_ID": post_data.ORDERID };
    //         console.log(params);

    //         checksum_lib.genchecksum(params, 'bDunc9kI3MxiujAT', function (err, checksum) {

    //             params.CHECKSUMHASH = checksum;
    //             post_data = 'JsonData=' + JSON.stringify(params);

    //             var options = {
    //                 hostname: 'securegw-stage.paytm.in', // for staging
    //                 // hostname: 'securegw.paytm.in', // for production
    //                 port: 443,
    //                 path: '/merchant-status/getTxnStatus',
    //                 // path: '/order/status',
    //                 method: 'POST',
    //                 headers: {
    //                     'Content-Type': 'application/x-www-form-urlencoded',
    //                     'Content-Length': post_data.length
    //                 }
    //             };


    //             // Set up the request
    //             var response = "";
    //             var post_req = https.request(options, function (post_res) {
    //                 // console.log(post_res);
    //                 post_res.on('data', function (chunk) {
    //                     response += chunk;
    //                 });

    //                 post_res.on('end', function () {
    //                     console.log('S2S Response: ', response, "\n");

    //                     var _result = JSON.parse(response);
    //                     if (_result.STATUS == 'TXN_SUCCESS') {

    //                         let query = { order_id: req.body.ORDERID },
    //                             update = { $set: { payment_status: 'success' } },
    //                             options = { new: true }

    //                             console.log(query);

    //                         order.updateOne(query, update, options)
    //                         .then((ifsuccess) => {
    //                             console.log(ifsuccess, '----success');
    //                         })
    //                         .catch((e) => {
    //                             console.log(e, '-----payment successs but database error');
    //                         })
    //                         res.send('payment sucess')
    //                     } else {
    //                         res.send('payment failed')
    //                     }
    //                 });
    //             });

    //             // post the data
    //             post_req.write(post_data);
    //             post_req.end();
    //         });
    //     // });
    // }
}

module.exports = paytm;

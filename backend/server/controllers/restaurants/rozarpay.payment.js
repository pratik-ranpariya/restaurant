const shortid = require("shortid");
const Razorpay = require("razorpay");
const { subscription } = require("../../models/subscription")
const currentTime = require('../../utils/currentTime')

const razorpay = new Razorpay({
  key_id: "rzp_test_0jdmCXlJsGl7x1",
  key_secret: "Sk28STUPT1UKr178cKioN3M6",
});

class rozarpay {

  static rozarpay = async (req, res) => {
    try {
      const ifAvailable = await subscription.find({ restaurant_id: req.decodedToken._id })

/*      var runningSub = [], pendingSub = [];
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
        return res.json({ status: 500, msg: `currently you have one extra subcription so you do not buy this subcription` })
      }*/

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
        const payment_capture = 1;
        const amount = req.body.price;
        const currency = "INR";

        const options = {
          amount: parseInt(amount * 100),
          currency,
          receipt: shortid.generate(),
          payment_capture,
        };

        const response = await razorpay.orders.create(options);
        return res.json({
          status: 200,
          id: response.id,
          currency: response.currency,
          amount: parseInt(response.amount),
        });

      }
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = rozarpay;

const nodemailer = require('nodemailer')

async function sendEMail(receiverid, data) {
    // console.log(data)

    var tansporter = nodemailer.createTransport({
        service: process.env.MAIL_SERVICE,
        auth: {
            user: process.env.USERID,
            pass: process.env.PASSWORD
        }
    })


    var mailoption = {

        from: `<${process.env.USERID}>`,
        to: receiverid,
        subject: data.subject,
        html: data.html

    }
    return new Promise(function (resolve, reject) {
        tansporter.sendMail(mailoption, (err) => {
            (err) ? reject(err) : resolve(true)
        })
    })

}

module.exports = sendEMail

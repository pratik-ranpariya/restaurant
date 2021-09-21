const uniqid = require('randomatic')
var otpJson = []

const createOtp = async (data) => {
    var otp = uniqid('0', 6);
    otpJson[data] = otp
    return otp
}

const verifyOTP = async (email, otp) => {
    if (otpJson[email] == otp) {
        delete otpJson[email]
        return true
    } else {
        return false
    }
}

module.exports = {
    createOtp,
    verifyOTP
}
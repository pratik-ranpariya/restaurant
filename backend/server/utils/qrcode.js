var QRCode = require('qrcode')

const qrdata = async (data) => {
    const createqr = await QRCode.toDataURL(data)
    return createqr
}

module.exports = qrdata
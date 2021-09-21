const multer = require('multer')
const path = require('path');
const fs = require("fs")

const FileUpload = (req, res, next) => {

    req.newFile_name = [];
    upload(req, res, async function (err) {
        if (err) {
            console.log(err)
            return res.json({ status: 500, msg: 'file not upload' })
        } else {
            const files = req.files;
            let index, len;
            var filepathlist = []
            for (index = 0, len = files.length; index < len; ++index) {
                let filepath = process.env.IMAGEPREFIX + files[index].path.slice(4,);
                filepathlist.push(filepath)
                if (req.newFile_name.length === index + 1) {
                    next()
                }
            }
        }
    })
}

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
            fs.access("./server/chatFiles/", function (error) {
                if (error) {
                    fs.mkdirSync('./server/chatFiles/', 0744)
                    callback(null, './server/chatFiles/');
                } else {
                    callback(null, './server/chatFiles/');
                }
            })
    },
    filename: function (req, file, callback) {
        var file_name = file.fieldname + '-' + Date.now() + path.extname(file.originalname)
        req.newFile_name.push(file_name);
        callback(null, file_name);
    }
})

const upload = multer({
    storage: storage
}).any()

module.exports = FileUpload;

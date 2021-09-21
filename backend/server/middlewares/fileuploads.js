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
	    if(!files[0]){
                next()
            }
        }
    })
}

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        if ("csv" === file.fieldname) {
            callback(null, './server/csv');
        } else {
            fs.access("./server/img/" + req.decodedToken._id, function (error) {
                if (error) {
                    fs.mkdirSync('./server/img/' + req.decodedToken._id, 0744)
                    callback(null, './server/img/' + req.decodedToken._id);
                } else {
                    callback(null, './server/img/' + req.decodedToken._id);
                }
            })
        }
    },
    filename: function (req, file, callback) {
        if ("image" === file.fieldname) {
            var file_name = file.originalname
        } else {
            var file_name = file.fieldname + '-' + Date.now() + path.extname(file.originalname)
        }
        req.newFile_name.push(file_name);
        callback(null, file_name);
    }
})

const upload = multer({
    storage: storage
}).any()

module.exports = FileUpload;

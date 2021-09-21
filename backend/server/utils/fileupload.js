const multer = require('multer')
var path = require('path')

const FileUpload = (req, res) => {

    req.newFile_name = [];
    upload(req, res, async function (err) {
        if (err) {
            return res.json({ status: 500, msg: 'file not upload' })
        } else {
            const files = req.files;
            let index, len;
            var filepathlist = []
            for (index = 0, len = files.length; index < len; ++index) {
                let filepath = process.env.IMAGEPREFIX + files[index].path.slice(4,);
                filepathlist.push(filepath)
            }
        }
    })
}

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        if ("csv" === file.mimetype.split('/')[file.mimetype.split('/').length - 1]) {
            callback(null, './server/csv');
        } else {
            callback(null, './server/img');
        }
    },
    filename: function (req, file, callback) {
        var file_name = file.fieldname + '-' + Date.now() + path.extname(file.originalname)
        req.newFile_name.push(file_name);
	console.log(req.newFile_name)
        callback(null, file_name);
    }
})

const upload = multer({
    storage: storage 
}).any()
    
module.exports =  FileUpload;

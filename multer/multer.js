const multer = require("multer")
const path = require("path")
const {v4:uuid} = require("uuid")

const userMulter = multer({
    storage:multer.diskStorage({
        destination:(req,file,cb)=>{
            cb(null,"public/images")
        },
        filename:(req,file,cb)=>{
            cb(null,uuid()+path.extname(file.originalname))
        }
    })
})

module.exports = {userMulter}
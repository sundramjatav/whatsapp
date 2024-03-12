const mongoose = require("mongoose")

const messageSchema = new mongoose.Schema({
    message:String,
    senderid:{type:mongoose.Schema.Types.ObjectId,ref:"user"},
    receiverid:{type:mongoose.Schema.Types.ObjectId,ref:"user"},
},{versionKey:false,timestamps:true})
const messageModel = mongoose.model("message",messageSchema)

module.exports = {messageModel}
const io = require("socket.io")()
const userModel = require("./model/user")
const {messageModel} = require("./model/message")
const socketApi = {io:io}

io.on("connection",(socket)=>{
    console.log("connected")
    socket.on("join-user",async userid=>{
        const userFind = await userModel.findById(userid)
        userFind.socketId = socket.id
        await userFind.save()
        
        const onlineUsers = await userModel.find({
            socketId:{$nin:["",socket.id]},
            _id:{$nin:[userFind._id]}
        })
        onlineUsers.forEach(user=>{
            socket.emit("send-users",{
                picture:user.profileImage,
                id:user._id,
                username:user.username,
                lastMessage:"Hello !"
            })
        })
        socket.broadcast.emit("send-users",{
            picture:userFind.picture,
            id:userFind._id,
            username:userFind.username,
            lastMessage:"Hello !"
        })

        socket.on("send-message",async data=>{
            await messageModel.create({message:data.message,senderid:data.senderid,receiverid:data.receiverid})
            const receiverUserId = await userModel.findById(data.receiverid)
            io.to(receiverUserId.socketId).emit("receive-message",data)
        })
    })
    socket.on("get-message",async data=>{
        const allMessage = await messageModel.find({
            $or:[
                {
                    senderid:data.senderid,
                    receiverid:data.receiverid
                },
                {
                    receiverid:data.senderid,
                    senderid:data.receiverid
                },
                
            ]
        })
        console.log(allMessage)
        socket.emit("get-message",allMessage)
    })
    socket.on("disconnect",async ()=>{
        console.log("disconnect")
        await userModel.findOneAndUpdate({socketId:socket.id},{socketId:""},{new:true})
    })
})

module.exports = {socketApi}
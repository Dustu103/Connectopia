const express =require('express')
const { Server } =require('socket.io')
const { createServer }= require('node:http');
const userDetails = require('../controlers/userDetails');
const User = require('../Model/User');
const Message = require('../Model/Message');
const chatModel = require('../Model/chatModel');

const app= express()

// Socket connection
const server = createServer(app)
const io = new Server(server,{
    cors: {
        origin: process.env.FRONTEND_URL,
        credentials: true
    }
})

// online status
const onlineUser = new Set()

io.on('connection',async(socket)=>{

    // current user details
    // console.log(socket);

    const token = socket.handshake.auth.token

    const req = {
        cookies: {
            token: token // Set the token in the cookies
        }
    };

    const res = {
        status: (statusCode) => ({
            json: (responseBody) => {
                // Handle the response here (e.g., send it back to the client)
                return Promise.resolve({ statusCode, body: responseBody });
            }
        })
    };

    const data = await userDetails(req,res)
    // console.log(data);
    // console.log("token",data.body.data._id)

    // create a room
    socket.join(data.body.data._id.toString())
    onlineUser.add(data.body.data._id.toString())

    io.emit('onlineUser',Array.from(onlineUser))  //io represents the entire Socket.io server instance and is used to manage the overall connections, send messages to all connected clients, or broadcast events.

    socket.on('message',async(id)=>{   //socket represents a single client connection and is used to interact with that specific client (or room).

        // message = message-page
        const userDetails= await User.findById(id).select('-password');

        const payload ={
            _id: userDetails._id,
            name: userDetails.name,
            email: userDetails.email,
            profile_pic: userDetails.profile_pic,
            online : onlineUser.has(id.toString())
        }
        
        socket.emit('isonline',payload) //message-user = isonline

        // finding prevmessages
        const getPrevConversation = await Message.findOne({
            "$or":[
                {sender : data.body.data._id, receiver:id},
                {sender : id, receiver: data.body.data._id},
            ]
        }).populate('chats').sort({ updatedAt: -1 })
        // console.log(data);
        // io.to(data.body.data._id.toString()).emit('convmessage',getPrevConversation?.chats || [])
        // io.to(id.toString()).emit('convmessage',getPrevConversation?.chats || [])
        // console.log(getPrevConversation?.chats||[])
        socket.emit('prevmessages',getPrevConversation?.chats||[])
    })

    // prev messages
    // socket.emit('prevmessage',()=>{
        
    // })

      
    // disconnect
    socket.on('newmessages',async (data) => {
        // console.log(data);
        let conversation = await Message.findOne({
            "$or":[
                {sender : data?.senderId, receiver: data?.receiverId},
                {sender : data?.receiverId, receiver: data?.senderId},
            ]
        })
        if(!conversation){
            const createConversatation = await Message({sender:data?.senderId,
                     receiver:data?.receiverId
            })
            conversation = await createConversatation.save()
        }
        const message = new chatModel({
            text: data?.text,
            fileUrl: data?.fileUrl, 
            msgByUserId: data?.senderId          
        })
        const saveMessage= await message.save()
        const updateConversation = await Message.updateOne({_id: conversation._id},{
            "$push":{ chats: saveMessage?._id}
        })

        const getConversation = await Message.findOne({
            "$or":[
                {sender : data.senderId, receiver: data?.receiverId},
                {sender : data.receiverId, receiver: data?.senderId},
            ]
        }).populate('chats').sort({ updatedAt: -1 })
        // console.log(getConversation)
        // console.log(data);
        io.to(data?.senderId.toString()).emit('convmessage',getConversation?.chats || [])
        io.to(data?.receiverId.toString()).emit('convmessage',getConversation?.chats || [])

        // seen or unseen
    })

    // sidebar
    socket.on('sidebar',async(currentUserId)=>{
        // console.log(currentUserId)
        const currentUserConversation = await Message.find({
            "$or": [
                {sender:currentUserId},
                {receiver:currentUserId}
            ]      
        }).populate('chats').sort({ updatedAt: -1 }).populate('sender').populate('receiver')

        const conversation = currentUserConversation.map((conv)=>{
            const otherUser = conv?.sender?._id.toString() === currentUserId ? conv?.receiver : conv?.sender;
            // console.log(conv)
            const countUnseenMsg = conv.chats.reduce((prev,curr)=>{
                if(curr?.msgByUserId.toString()!==currentUserId){
                    return prev +(curr.seen?0:1)
                }                 
                else {
                    return prev
                }
            },0)
            return {
                _id: conv?._id,
                sender: currentUserId,
                receiver: otherUser,
                unSeenmsg : countUnseenMsg,
                lastMsg: conv.chats[conv?.chats?.length-1]
            }
        })

        // console.log(conservation)
        socket.emit('conversation',conversation||[])
    })

    socket.on('seen',async(MsgByUserId)=>{
        const conversationSeen =await Message.findOne({
            "$or":[
                {sender : data.body.data._id, receiver: MsgByUserId},
                {sender : MsgByUserId, receiver: data.body.data._id},
            ]
        })

        const conversationMsgById = conversationSeen?.chats
        // console.log(conversationMsgById)
        const updatedMessages = await chatModel.updateMany(
            { _id : { "$in": conversationMsgById}, msgByUserId: MsgByUserId}, {"$set": {seen: true}}
        )
        
        io.to(data.body.data._id.toString()).emit('convmessage',updatedMessages || [])
        io.to(MsgByUserId.toString()).emit('convmessage',updatedMessages || [])

    })

    // disconnect
    socket.on('disconnect',()=>{ 
        onlineUser.delete(data.body.data._id.toString())
        // console.log("Discionnect user",socket.id)
    })
})

module.exports={
    app,
    server
}
const expressAsyncHandler = require("express-async-handler");
const Chat = require('../Model/chatModel')
const User = require('../Model/User')

const accessChat = expressAsyncHandler(async  (req,res,next)=> {
    const {userId} = req.body
    if(!userId){
        console.log("UserId not find");
        return res.status(400)
    }

    var isChat = await Chat.find({
        isgroupChat: false,
        $and: [
            {users: {$elemMatch: {$eq: req.user._id}}},
            {users: {$elemMatch: {$eq: userId}}}
        ]
    }).populate("users","-password").populate("latestMessage")

    isChat = await User.populate(isChat,{
        path:"latestMessage.sender",
        select: "name email profilepic"
    })

    if(isChat.length>0){
        res.send(isChat[0])
    }else{
        var chatData = {
            chatName : "sender",
            isgroupChat:false,
            users:[req.user._id,userId]
        }

        try{
            const createdChat = await Chat.create(chatData)
            const fullChat = await Chat.findOne({_id: createdChat._id}).populate("users","-password")
            res.status(200).send(fullChat)
        } catch(err){
            throw new Error(err.message)
        }
    }
})

const fetchChat = expressAsyncHandler(async(req,res,next)=>{
    try{
        const chats =await Chat.find({users: {$elemMatch:{$eq : req.user._id}}}).populate("users","-password").populate("latestMessage").populate("groupAdmin")
        res.status(200).send(chats).sort({updatedAt : -1}).then(async (results) => {
            results = await User.populate(results,{
                path:"latestMessage.sender",
                select: "name email profilepic"
            })
            res.status(200).send(results)
        })

    }
    catch(err){
        console.log(err.message)
        throw new Error(err.message)
    }
})

const createGroupChat = expressAsyncHandler(async(req,res,next)=>{
    var {groupName,users} =req.body
    if(!groupName ){
        return res.status(400).send({message:"Please Give a Group Name"})
    }

    users=JSON.parse(req.body.users);
    users.push(req.user)

    try{
        const groupChat = await Chat.create({
            chatname : groupName,
            users : users,
            isgroupChat : true,
            groupAdmin : req.user
        })

        const fullGroupChat = await Chat.findOne({_id: groupChat._id}).populate("users","-password").populate("groupAdmin","-password")

        res.status(200).send(fullGroupChat)
    }
    catch(err) {
        console.log(err.message)
    }
})


const renameGroup = expressAsyncHandler(async(req,res)=>{
    const {chatId,chatName}= req.body;
    const updatechat = await Chat.findByIdAndUpdate(chatId,{chatname: chatName},{new : true }).populate("users","-password").populate("groupAdmin","-password")

    if(!updatechat){
        res.status(404)
        throw new Error("Chat is not founded")
    }else{
        res.json(updatechat)
    }
})


const addToGroup = expressAsyncHandler(async(req,res,next)=>{
    const {chatId,userId}= req.body;
    const groupChat = Chat.findByIdAndUpdate(chatId,{
        $push : {users: userId},
        },{
            new: true
        }).populate("users","-password").populate("groupAdmin","-password")

        if(!groupChat){
            res.status(400)
            throw new Error("Chat is not Found")
        } else{
            res.json(groupChat)
        }
})

const removeFromGroup = expressAsyncHandler(async(req,res)=>{
    const {chatId,userId}= req.body;
    const groupChat = Chat.findByIdAndUpdate(chatId,{
        $pull : {users: userId},
        },{
            new: true
        }).populate("users","-password").populate("groupAdmin","-password")

        if(!groupChat){
            res.status(400)
            throw new Error("Chat is not Found")
        } else{
            res.json(groupChat)
        }

})

module.exports={accessChat,fetchChat,createGroupChat,renameGroup,addToGroup,removeFromGroup}
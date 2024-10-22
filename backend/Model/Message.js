const mongoose = require('mongoose');
const { Schema } = mongoose;
const chat = require('./chatModel')
const User= require('./User')

const messageSchema = new Schema({
    sender:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    receiver:{
         type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    // content: {type:String },
    chats:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Chat"
        }
    ]
},
{
    timestamps:true
}
)

module.exports= mongoose.model('Message',messageSchema)
const mongoose = require('mongoose');
const { Schema } = mongoose;
const Message=require('./Message')
const User= require('./User')

const chatSchema = new Schema({
   text :{
     type :String,
     default:""
   },
   fileUrl:{
     type :String,
     default:""
   },
   seen :{
      type : Boolean,
      default: false
   },
   msgByUserId :{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref:"User"
   }
},
{
  timestamps:true  
})

module.exports= mongoose.model('Chat',chatSchema);

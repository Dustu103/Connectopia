const mongoose = require('mongoose');
const { Schema } = mongoose;
var bcrypt = require('bcryptjs');

const userSchema= new Schema({
    name:{
        type:String,
        required:[true,"Please provide the name"]
    },
    password:{
        type:String,
        required:[true,"Please choose a password"]
    },
    email:{
        type:String,
        required:[true,"Please provide email id"]
    },
    profile_pic: {
        type: String,
        required:true,
        default:"https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
    }
},{
    timestamps:true
})

userSchema.methods.matchPassword= async function(password) {
    return bcrypt.compare(password,this.password)
}

userSchema.pre('save', async function (next) {
    if(!this.isModified){
        next()
    }
   
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

module.exports = mongoose.model('User',userSchema)
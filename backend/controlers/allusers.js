const asyncHandler = require('express-async-handler')
const User = require('../Model/User')


const allUsers = asyncHandler(async(req,res)=>{
        const users =await User.find({_id:{$ne:req.user._id}}).select('-password')
    // console.log(users)
    return res.json({
        data:users
    })
})

module.exports= allUsers
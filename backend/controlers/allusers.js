const asyncHandler = require('express-async-handler')
const User = require('../Model/User')


const allUsers = asyncHandler(async(req,res)=>{
    // const response= req.query.search ? {
    //     $or:[
    //         {name :{ $regex : req.query.search, $options : "i"}},
    //         {email :{ $regex : req.query.search, $options : "i"}}
    //     ]
    // } : {}

    const users =await User.find({_id:{$ne:req.user._id}}).select('-password')
    return res.json({
        data:users
    })
})

module.exports= allUsers
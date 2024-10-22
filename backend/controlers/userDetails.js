const jwt = require('jsonwebtoken')
const User = require("../Model/User")
const asyncHandler = require('express-async-handler')

const userDetails = asyncHandler(async (req,res) =>{
    let token=req.cookies.token||"";
    if(token){
        try {
           const decoded = jwt.verify(token,process.env.JWt_SECRET)
           const user = await User.findById(decoded.id).select("-password")
           return res.status(200).json({
            data:user
           })
        }
        catch(err){
           return res.status(401).json({
                message:"Not authorized token, failed",
                error: true
            })
        }
    }
    else{
      return  res.json({
            message : "Your session is expired",
            error : true
        })
    }
})

module.exports = userDetails
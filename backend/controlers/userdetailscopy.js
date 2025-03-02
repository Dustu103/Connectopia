const jwt = require('jsonwebtoken')
const User = require("../Model/User")
const asyncHandler = require('express-async-handler')

const userDetailsSocket = asyncHandler(async (req,res) =>{
    // console.log(req.headers.authorization);
    let token= req?.cookies?.token  ||"";
    // console.log(token)
    if(token){
        try {
           const decoded = jwt.verify(token,process.env.JWT_SECRET)
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

module.exports = userDetailsSocket
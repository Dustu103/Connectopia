const jwt = require('jsonwebtoken')
const User = require("../Model/User")
const asyncHandler = require('express-async-handler')

const protect = asyncHandler(async (req,res,next) =>{
    let token=req.cookies.token||"";
    // console.log(req.headers.authorization)

    if(token){
        try {
            // token = req.headers.authorization.split(" ")[1];
           const decoded = jwt.verify(token,process.env.JWt_SECRET)
           req.user = await User.findById(decoded.id).select("-password")
           next()
        }
        catch(err){
           return res.status(401).json({
                message:"Not authorized token failed",
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

module.exports = protect
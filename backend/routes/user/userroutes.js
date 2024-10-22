const express = require('express')
const router = express.Router()
const {registeruser,authUser, forgetpassword} = require('../../controlers/login')
const User = require('../../Model/User')
const protect = require('../../Middleware/authmiddleware')
const allUsers = require('../../controlers/allusers')
const logout = require('../../controlers/logout')
const updateUserDetails = require('../../controlers/updateuserDetails')
const userDetails = require('../../controlers/userDetails')

router.route('/').get(protect,allUsers)
router.post('/register',async(req,res)=>{
    await registeruser(req,res);
})
router.post('/login',async(req,res)=>{
   authUser(req,res)
})
router.post('/logout',logout)
router.post('/updatedetails',protect, updateUserDetails);
router.post('/forgetPassword',forgetpassword)
router.get('/userdetails',userDetails);

router.get("/chat",async(red,res)=>{
    const data = await User.find({});
    res.status(200).json(data);
})





module.exports= router
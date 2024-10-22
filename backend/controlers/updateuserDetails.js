const protect = require("../Middleware/authmiddleware");
const User = require("../Model/User");

async function updateUserDetails(req,res) {
    try {
       const user=  req.user;
       const { name, profile_pic }= req.body
       const updatedUser = await User.findByIdAndUpdate(
        user._id, 
        { $set: { name: name,profile_pic:profile_pic } }, 
        { new: true }
      )

      return res.json({
        message: "Updated Successfully",
        success: true,
        data: updatedUser
      })

    } catch (error) {
        res.status(405).json({
            message:"Something went wrong",
            error: true
        })
    }
}

module.exports = updateUserDetails;
const asyncHandler = require("express-async-handler");
const User = require("../Model/User");
const generateToken = require("./generateToken");

const registeruser = asyncHandler(async (req, res) => {
  const { name, email, password, profile_pic } = req.body;

  if (!name || !email || !password) {
    throw new Error("Please fill all the fields");
  }

  const userExists = await User.findOne({ email });
  // console.log(userExists)
  if (userExists) {
    return res.status(409).json({
      message: "Email already accepted",
      error: true,
    });
  }
  try {
    const user = await User.create({
      name,
      email,
      password,
      profile_pic:
        profile_pic !== ""
          ? profile_pic
          : "https://res.cloudinary.com/djvjxp2am/image/upload/v1633666824/Profile%20Pic/blank-profile-picture-973460_640",
    });
    console.log(true)
    const jwt = await generateToken(user._id);
    const cookieOption = {
      http: true,
      secure: true,
    };

    if (user) {
      return res.cookie("token", jwt, cookieOption).status(201).json({
        token: jwt,
        message: "Acount successfully created",
        success: true,
      });
    } else {
      return res.status(400).json({
        message: "Check network connection",
        error: true,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error, please try again",
      error: error,
    });
  }
});

const authUser = async function (req, res) {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({
      message: "No user with this mail are found",
      error: true,
    });
  }

  const cookieOption = {
    http: true,
    secure: true,
  };

  if (user && (await user.matchPassword(password))) {
    const token = await generateToken(user._id);
    return res.cookie("token", token, cookieOption).status(200).json({
      message: "Successfully logged in",
      token: token,
      success: true,
    });
  } else {
    return res.status(401).json({
      message: "Email or password is incorrect",
      error: true,
    });
  }
};

const forgetpassword = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "No user with this mail are found",
        error: true,
      });
    }

    user.password = password;
    await user.save();

    return res.status(200).json({
      message: "Password has been successfully updated",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error, please try again later",
      error: true,
    });
  }
};

module.exports = { registeruser, authUser, forgetpassword };

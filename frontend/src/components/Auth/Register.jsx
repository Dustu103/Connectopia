import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // Ensure this file is in the same directory or adjust the path accordingly
import { FaEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import verifyEmail from "../../helperfunc/emailvalidation";
import { useDispatch } from "react-redux";
import { setUser } from "../../Redux/User/userSlice";


const SignIn = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [profilepic, setProfilePic] = useState();
  const [loading, setLoading] = useState(false);
  
  const [profilePicPreview, setProfilePicPreview] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImg = () => {
    setLoading(true);
    if (profilepic === undefined) {
      toast.error('Please select a picture');
      setLoading(false);
      return false;
    }

    if (profilepic.type === "image/jpeg" || profilepic.type === "image/png") {
      const data = new FormData();
      data.append("file", profilepic);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", `${process.env.REACT_APP_CLOUD_NAME}`);
      return fetch(
        `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME}/image/upload`,
        {
          method: "post",
          body: data,
        }
      )
        .then((res) => res.json())
        .then((data) => {
          setLoading(false);
          return data.url.toString();
        })
        .catch((error) => {
          toast.error("Something went wrong, sorry");
          setLoading(false);
          return false;
        });
    } else if (profilepic) {
      toast.error("Only jpeg, png, jpg format is allowed");
      setLoading(false);
      return false;
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let emailexist = verifyEmail(email);
    // const public_key = await generateKeyPair(name,email)
    // const key= localStorage.getItem('privateKey')
    // const privateKey = encryptPrivateKey(key,email)
    // console.log(privateKey);
    // return;
    if(!emailexist){
         return navigate('/register')
    }
    let imgUploaded = "";
    if(profilepic !== undefined){
    // Wait for image upload
     imgUploaded = await uploadImg();
    if (!imgUploaded) {
      setLoading(false);
      return toast.error("Image upload failed");
    }
    }
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
  
      const { data } = await axios.post(`${process.env.REACT_APP_BACKEND}/user/register`,
        { name, email, password, profile_pic: imgUploaded },
        config
      );
  
      localStorage.setItem("userInfo", JSON.stringify(data));
      toast.success("User created successfully");
      dispatch(setUser(data));
      // Redirect to chat page after successful registration
      navigate("/chat");
    } catch (err) {
      console.log(err)
      setLoading(false);
      return toast.error(err.response.data.message);
    }
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden flex items-center justify-center bg-[#061126]">
      <div className="background-animation"></div>
      <div className="circular-gradient"></div>

      {/* Added gradient background animation */}

      <div className="relative z-10 bg-white bg-opacity-10 backdrop-blur-2xl rounded-lg shadow-lg p-8 w-full max-w-lg lg:w-1/2 md:w-2/3 border border-opacity-30 border-gray-300">
        <div className="p-3 space-y-2 md:space-y-3 sm:p-4">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-100 md:text-2xl">
            Register as a new user
          </h1>
          <form className="space-y-4 md:space-y-6" method="post">
            <div className="flex flex-col items-center">
              <label
                htmlFor="profilepic"
                className="block mb-2 text-sm font-medium text-gray-200"
              >
                Profile Picture
              </label>
              <div className="relative">
                <input
                  type="file"
                  name="profilepic"
                  id="profilepic"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleFileChange}
                />
                <div
                  className={`w-24 h-24 rounded-full border-2 border-gray-600 overflow-hidden ${
                    profilePicPreview ? "p-1" : "bg-gray-700"
                  } flex items-center justify-center`}
                >
                  {profilePicPreview ? (
                    <img
                      src={profilePicPreview}
                      alt="Profile Preview"
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <img src="https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg" alt="Profile Img" />
                  )}
                </div>
              </div>
            </div>
            <div>
              <label
                htmlFor="full-name"
                className="block mb-2 text-sm font-medium text-gray-200"
              >
                Full Name
              </label>
              <input
                type="text"
                name="full-name"
                id="full-name"
                className="bg-[#020b1a] bg-opacity-50 border text-gray-200 rounded-lg focus:ring-blue-500 block w-full p-2.5"
                placeholder="John Doe"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-200"
              >
                Your email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                className="bg-[#020b1a] bg-opacity-50 border text-gray-200 rounded-lg focus:ring-blue-500 block w-full p-2.5"
                placeholder="name@company.com"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-200"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={passwordVisible ? "text" : "password"}
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-opacity-50 border text-gray-200 rounded-lg focus:ring-blue-500 block w-full p-2.5 bg-[#020b1a] pr-10"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-600"
                >
                  {passwordVisible ? (
                    <FaEye style={{ color: "white" }} />
                  ) : (
                    <FaRegEyeSlash style={{ color: "white" }} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              onClick={handleFormSubmit}
            >
              {loading ? "Loading..." : "Sign Up"}
            </button>
            <p className="text-sm font-light text-gray-200">
              Already have an account?{" "}
              <Link
                to="/"
                className="font-medium text-blue-500 hover:underline"
              >
                Login here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;

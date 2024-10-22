import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaCamera } from "react-icons/fa";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { updateUser } from "../../Redux/User/userSlice";



function UpdateUser() {
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.user.users);
  console.log(user)
  const [profilePicPreview, setProfilePicPreview] = useState(
    user[0]?.data.profile_pic
  );
  const [profilepic, setProfilePic] = useState();
  const [email, setEmail] = useState(user[0]?.data.email);
  const [name, setName] = useState(user[0]?.data.name);
  const [isHovered, setIsHovered] = useState(false);
  const [profileUrl,setProfileUrl] = useState('')
  const navigate = useNavigate()
   const dispatch = useDispatch()

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
    // console.log(profilepic)
    if (profilepic === undefined) {
      // console.log("hi")
      return profilePicPreview
       
    }

    if (profilepic.type === "image/jpeg" || profilepic.type === "image/png") {
      // console.log("yeah nice")
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
          console.log(data.url.toString())
          setProfileUrl(data.url.toString());
          setLoading(false);
          return data.url.toString();
        })
        .catch((error) => {
          toast.error("Something went wrong, sorry")
          setLoading(false)
          return null;
        });
    } else if(profilepic){
      toast.error("Only jpeg, png, jpg format is allowed")
      setLoading(false);
      return null;
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);    
    try {
      const imgUploaded = await uploadImg(); // Wait for image upload
      console.log(imgUploaded)
      // console.log(profileUrl)
      if (imgUploaded===null) {
        setLoading(false);
        return toast.error("Something went wrong")
      }
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      // console.log(profileUrl);
      const { data } = await axios.post(
        "/user/updatedetails",
        { name, email, profile_pic: imgUploaded },
        config
      );
       dispatch(updateUser({ name, email, profile_pic: imgUploaded }));
      localStorage.setItem("userInfo", JSON.stringify(data));
      toast.success("Updated Successfully")
      navigate("/chat");
    } catch (err) {
      setLoading(false);
      return toast.error(err.message);
    }
  };


  return (
    <div>
      <div className="relative h-screen w-screen overflow-hidden flex items-center justify-center bg-[#061126]">
        <div className="background-animation"></div>
        <div className="neon-lights"></div>

        {/* Adjusted width for large screens */}
        <div className="relative z-10 bg-white bg-opacity-10 backdrop-blur-2xl rounded-lg shadow-lg p-8 w-full max-w-lg lg:w-1/2 md:w-2/3 border border-opacity-30 border-gray-300">
          <div className="p-3 space-y-2 md:space-y-3 sm:p-4">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-100 md:text-2xl">
              Update User Details
            </h1>
            <form className="space-y-4 md:space-y-6" method="post">
              <div className="flex flex-col items-center">
                <label
                  htmlFor="profilepic"
                  className="block mb-2 text-sm font-medium text-gray-200"
                >
                  Profile Picture
                </label>
                <div className="relative group">
                  <div
                    className={`w-24 h-24 rounded-full border-2 border-gray-600 overflow-hidden ${
                      profilePicPreview ? "p-1" : "bg-gray-700"
                    } flex items-center justify-center`}
                  >
                    <img
                      src={profilePicPreview}
                      alt="Profile Preview"
                      className="w-full h-full object-cover rounded-full"
                      onMouseEnter={() => setIsHovered(true)}
                      onMouseLeave={() => setIsHovered(false)}
                    />

                    {isHovered && (
                     <div
                     className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center rounded-full"
                     onMouseEnter={() => setIsHovered(true)}
                     onMouseLeave={() => setIsHovered(false)}
                   >
                     <label className="cursor-pointer text-center">
                       <FaCamera size={22} className="w-full flex justify-center" style={{ color: "white" }} />
                       <p className="text-white text-xs mt-1">Change Profile Picture</p>
                       <input
                         type="file"
                         accept="image/*"
                         className="hidden"
                         onChange={handleFileChange}
                       />
                     </label>
                   </div>
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
                  value={name}
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                onClick={handleFormSubmit}
              >
                {loading ? "Loading..." : "Update"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateUser;

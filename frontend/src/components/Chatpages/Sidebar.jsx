import React, { useEffect, useState } from "react";
import { MdChat } from "react-icons/md";
import { MdOutlinePersonAddAlt1 } from "react-icons/md";
import { LuLogOut } from "react-icons/lu";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import SearchUser from "./SearchUser";
import { useDispatch } from "react-redux";
import { logout } from "../../Redux/User/userSlice";

function Sidebar({ username, url }) {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const [openSearchUser,setOpenSearchUser]=useState(false)
  
  const updateUser = () => {
    navigate("/updateuser");
  };

  const logoutUser = ()=>{
    dispatch(logout())
    navigate('/')
  }


  return (
    <div>
    <div className="h-screen w-full p-2 bg-gray-900 flex flex-col justify-between items-center py-4">
      {/* Top icons */}
      {/* {console.log(username)} */}
      {/* {console.log(allUser)} */}
      <div className="flex flex-col space-y-8 items-center">
        <div className="relative group">
          <Link to="/chat">
            <MdChat className="text-teal-300 text-3xl cursor-pointer hover:text-white" />
          </Link>
          <div className="absolute ml-4 w-[40px] bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Chats
          </div>
        </div>
        <div className="relative group">
          <MdOutlinePersonAddAlt1 onClick={()=>setOpenSearchUser(true)} className="text-teal-300 text-3xl cursor-pointer hover:text-white" />
          <div className="absolute  transform -translate-x-1/2 ml-[40px] bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Search New Chats
          </div>
        </div>
      </div>

      {/* Bottom icon */}
      <div className="pb-4">
        <button
          className="rounded-full md:h-[65px] h-[40px] w-full bg-white p-0 mb-4 overflow-hidden" // Adjusted padding and added overflow-hidden
          title={username}
          onClick={updateUser}
        >
          <img
            src={url}
            alt={username}
            className="h-full w-full object-cover" // Set both height and width to full
          />
        </button>
        <div className="relative group">
          <LuLogOut onClick={logoutUser} className="text-teal-300 text-3xl cursor-pointer hover:text-red-400 md:ml-4" />
          <div className="absolute ml-4 w-auto bg-gray-800 text-white text-sm rounded opacity-0 mb-4 group-hover:opacity-100 transition-opacity duration-200">
            Logout
          </div>
        </div>
      </div>        
    </div>
    {/* Search User */}
    {
        openSearchUser && (
          <SearchUser onClose={() => setOpenSearchUser(prev => !prev)}/>
        )
      }
    </div>
  );
}

export default Sidebar;

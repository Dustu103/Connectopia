import React, { useEffect, useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import Sidebar from './Sidebar';
import ConversationList from './Users';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, setOnlineUser } from '../../Redux/User/userSlice';
import background from './back.jpg';
import { initializeSocket, disconnectSocket } from '../../socket/socket';

function Chat() {
  const [userDetails, setUserDetails] = useState([]);
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const params = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const respon = JSON.parse(localStorage.getItem('userInfo'));
        const { data } = await axios.get(`${process.env.REACT_APP_BACKEND}/user/userdetails`, {
          headers: { Authorization: `${respon.token}` }
        });
        dispatch(setUser(data));
        setUserDetails(data);
      } catch (err) {
        console.log("Error fetching user details:", err);
      }
    };

    fetchData();
  }, []);

  // Initialize socket connection
  useEffect(() => {
    const respon = JSON.parse(localStorage.getItem('userInfo'));
    const socket = initializeSocket(respon.token);
    console.log("running")
    socket.on('onlineUser', (data) => {
      dispatch(setOnlineUser(data));
    });

    return () => {
      disconnectSocket();
    };
  }, []);

  return (
    <div className="flex h-screen relative overflow-hidden bg-gray-900">
      <div className="w-[5%] bg-gray-900">
        <Sidebar username={userDetails?.data?.name || 'Username'} url={userDetails?.data?.profile_pic} />
      </div>

      <div className="flex-grow flex flex-row mt-4 w-full">
        <div className='w-[37%] bg-gray-800 p-4 rounded-md shadow-md'>
          <ConversationList />
        </div>
        <div className='w-[61%] bg-gray-900 p-4 rounded-md shadow-md mr-2 pr-1'>
          {params.id === undefined ? (
            <img className='h-full w-full' style={{ objectFit: "cover" }} src={background} alt="Background" />
          ) : (
            <Outlet />
          )}
        </div>
      </div>
    </div>
  );
}

export default Chat;

import React, { useEffect, useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import Sidebar from './Sidebar';
import ConversationList from './Users';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, setOnlineUser, setSocketConnection } from '../../Redux/User/userSlice';
import io from 'socket.io-client';
import background from './back.jpg'

function Chat() {
  const [userDetails, setUserDetails] = useState([]);
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const params =useParams();
  console.log(params.id)

  const fetchData = async () => {
    try {
      const { data } = await axios.get('/user/userdetails');
      dispatch(setUser(data));
      setUserDetails(data);
    } catch (err) {
      console.log("how the error is happening");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Socket connection
  useEffect(() => {
    const respon = JSON.parse(localStorage.getItem('userInfo'));
    const socketConnection = io({
      auth: {
        token: respon.token
      }
    });

    socketConnection.on('onlineUser', (data) => {
      dispatch(setOnlineUser(data));
    });
    dispatch(setSocketConnection(socketConnection));

    return () => {
      socketConnection.disconnect();
    };

  }, []);

  return (
    <div className="flex h-screen relative overflow-hidden  bg-gray-900">
      <div className="w-[5%] bg-gray-900">
        <Sidebar username={userDetails?.data?.name || 'Username'} url={userDetails?.data?.profile_pic} />
      </div>

      <div className="flex-grow flex flex-row mt-4 w-full">
        <div className='w-[37%] bg-gray-800 p-4 rounded-md shadow-md'>
          <ConversationList />
        </div>
        <div className='w-[61%] bg-gray-900 p-4 rounded-md shadow-md mr-2 pr-1'>
          {/* {console} */}
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

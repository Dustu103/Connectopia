import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Login  from './components/Auth/Login';
import React from 'react';
import Register from './components/Auth/Register';
import Chat from "./components/Chatpages/chat";
import ChatRoom from "./components/Chatpages/Chatroom";
import toast, { Toaster } from 'react-hot-toast';
import ForgetPassword from "./components/Auth/ForgetPassword";
import UpdateUser from "./components/Auth/UpdateUser";


function App() {
  const router = createBrowserRouter([
    {
        path: "/",
        element: <Login/>
    },
    {
      path: "/register",
      element: <Register/>
    },
    {
      path: "/forgetpassword",
      element: <ForgetPassword/>
    },
    {
      path:"/chat",
      element: <Chat/>,
      children: [
        {path : ":id",
          element : <ChatRoom/>
        }
      ]
    },
    {
      path:"/updateuser",
      element: <UpdateUser/>
    }
    ])
  return (
    <>
           <Toaster/>
          <RouterProvider router={router} />
    </>
  );
}

export default App;

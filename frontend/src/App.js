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
import AuthenticatedRoute from "./helperfunc/AuthenticatedRoute";
import NotFound from "./components/404";


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
      element:(<AuthenticatedRoute> <ForgetPassword/></AuthenticatedRoute>)
    },
    {
      path:"/chat",
      element:(<AuthenticatedRoute><Chat/></AuthenticatedRoute>) ,
      children: [
        {path : ":id",
          element : <ChatRoom/>
        }
      ]
    },
    {
      path:"/updateuser",
      element:(<AuthenticatedRoute><UpdateUser/></AuthenticatedRoute>) 
    },
    {
      path: "*", // Catch-all route
      element: <NotFound/> // Render NotFound component for unmatched routes
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

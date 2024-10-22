import React, { useState, useEffect, useRef } from "react";
import { FaPaperPlane, FaSmile, FaPaperclip, FaTimes } from "react-icons/fa";
import EmojiPicker from "emoji-picker-react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import FilePreviewPopover from "./FilePreviewPopover";
import toast from "react-hot-toast";
import app from "../../fireStore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import moment from "moment";
import './customEmojiPicker.css'
import { MdTextSnippet } from 'react-icons/md';
// import data from '@emoji-mart/data'
// import Picker from '@emoji-mart/react'


// moment().format();

const ChatRoom = () => {
  const params = useParams();
  // console.log(params.id);
  const socketConnection = useSelector((state) => state?.user?.socketConnection);
  const user = useSelector((state) => state?.user);
  // console.log(user)
  // console.log(user?.users[0].data._id);
  const [userData, setUserData] = useState(); //dataUser = userData
  const [messageInput, setMessageInput] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const chatThreadRef = useRef(null);
  const [file, setFile] = useState();
  const [showPreview, setShowPreview] = useState(false);
  const [Allmessage, setAllmessage] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  //  scroll down
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  // let prevm =[]
  // let atBottom = false;
  useEffect(() => {
    chatThreadRef.current.scrollTop = chatThreadRef.current.scrollHeight;
  }, [])   //problem while hit allmessage

  const handleSubmit = async (e) => {
    e.preventDefault();
    let fileurl;
    if (file) {
      fileurl = await handleFileUpload();
    }
    if (messageInput.trim() !== "" || fileurl) {
      const newMessages = {
        text: messageInput.trim() || "",
        fileUrl: fileurl || "",
        type: "sent",
      };
      setAllmessage((prevmessages) => [...prevmessages, newMessages]);
      if (socketConnection) {
        socketConnection.emit("newmessages", {
          ...newMessages,
          senderId: user?.users[0].data._id,
          receiverId: params.id,
          timeStamp: new Date().toISOString(),
          msgByUserId: user?.users[0].data._id,
        });
      }
      setMessageInput("");
      setFile(null);
    }
  };

  const handleEmojiClick = (emojiObject) => {
    setMessageInput(messageInput + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const handleFileUpload = async () => {
    if (file) {
      setIsLoading(true);
      try {
        const storge = getStorage(app);
        const storageRef = ref(storge, "chatApp/" + file.name);
        await uploadBytes(storageRef, file);
        const downloadUrl = await getDownloadURL(storageRef);
        setShowPreview(false);
        setIsLoading(false);
        return downloadUrl;
      } catch {
        setIsLoading(false);
        return toast.error("Something went wrong");
      }
    }
  };
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      setShowPreview(true);
    }
  };

  const handleCancel = () => {
    setFile(null);
    setShowPreview(false);
  };


  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit("message", params.id);
      socketConnection.on("isonline", (data) => {
        setUserData(data);
        // console.log(data);
      });
      socketConnection.on("prevmessages", (data) => {
        setAllmessage(data);
      });
      socketConnection.emit("seen",params.id)
      return ()=>{ socketConnection.off('prevmessages')}
    }
  }, [socketConnection,user,userData,params,Allmessage]); //hit userdata


  return (
    <div className="flex flex-col h-full bg-gradient-to-r from-gray-800 via-black to-gray-900 z-10">
  {userData && (
    <div className="w-full bg-gradient-to-r from-gray-900 to-gray-700 h-[55px] rounded-md">
      <div className="flex items-center p-2 rounded-lg">
        {/* {console.log(Allmessage)} */}
        <img
          src={userData.profile_pic}
          alt={userData.name}
          className="w-12 h-12 rounded-full object-cover mr-3 border-2 border-gray-600"
        />
        <div className="flex flex-col">
          <p className="font-medium text-gray-100">{userData.name}</p>
          {userData.online ? (
            <p className="text-sm text-green-400">Online</p>
          ) : (
            <p className="text-sm text-gray-500">Offline</p>
          )}
        </div>
      </div>
    </div>
  )}
  {Allmessage  &&(
    <ul
      className="chat-thread flex-grow p-4 space-y-4 overflow-y-auto"
      style={{ height: "calc(100vh - 64px)" }}
      ref={chatThreadRef}
    >
      {Allmessage.map((message, index) => (
       <li
       key={index}
       className={`relative flex flex-col py-2 px-4 rounded-lg text-sm max-w-[90%] md:max-w-[70%] ${
         user?.users[0].data._id !== message.msgByUserId && message.msgByUserId !== undefined
           ?  "mr-auto bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600 text-black"
           : "ml-auto bg-gradient-to-r from-teal-500 via-teal-600 to-teal-700 text-white"
       }`}
     >
       {message.fileUrl && (
         <div className="w-full max-h-96 rounded-md mb-1">
           {message.fileUrl.includes('.mp4') ? (
             <video
               src={message.fileUrl}
               controls
               className="w-full h-96 rounded-md object-cover"
             />
           ) : message.fileUrl.includes('.txt') ? (
             <a
               href={message.fileUrl}
               className="flex items-center bg-gray-200 rounded-md p-2 mb-1 hover:bg-gray-300 transition-colors"
               target="_blank"
               rel="noopener noreferrer"
             >
               <MdTextSnippet className="mr-2 text-gray-600" size={24} /> {/* Using React Icon */}
               <span className="text-gray-700">Download Text File</span>
             </a>
           ) : (
             <img
               src={message.fileUrl}
               alt="Uploaded file"
               className="w-full h-auto rounded-md object-cover"
             />
           )}
         </div>
       )}
       {message.text && (
         <span className="text-sm">{message.text}</span>
       )}
       <p className="absolute bottom-1 right-2 text-xs text-gray-400">
         {moment(message.createdAt).format("hh:mm A")}
       </p>
     </li>
     
      ))}
    </ul>
  )}

{showEmojiPicker && (
  <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center">
    <div className="relative bg-gradient-to-r from-gray-800 via-gray-900 to-black rounded-lg shadow-lg p-4 max-w-md w-full">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-teal-400 font-semibold">Pick an Emoji</h4>
        <button
          onClick={() => setShowEmojiPicker(false)}
          className="text-teal-400 hover:text-teal-600"
        >
          <FaTimes className="text-xl" />
        </button>
      </div>

      {/* Custom EmojiPicker Wrapper */}
      <div className="bg-gradient-to-r from-black via-gray-800 to-gray-700 p-3 rounded-lg max-h-96 overflow-y-auto">
        <EmojiPicker 
          onEmojiClick={handleEmojiClick}
          className="custom-emoji-picker"
        />
      </div>
    </div>
  </div>
)}



  <form
    onSubmit={handleSubmit}
    className="flex items-center w-full p-4 bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900"
  >
    <button
      type="button"
      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
      className="text-gray-300 px-2"
    >
      <FaSmile style={{color:"yellow"}} className="text-2xl" />
    </button>

    <input
      className="flex-grow px-4 py-2 text-lg bg-white border-b-2 border-gray-400 text-gray-700 outline-none"
      type="text"
      value={messageInput}
      onChange={(e) => setMessageInput(e.target.value)}
      placeholder="Type a message..."
      autoComplete="off"
    />

    <input
      type="file"
      id="fileInput"
      style={{ display: "none" }}
      onChange={handleFileChange}
    />
    <label
      htmlFor="fileInput"
      className="cursor-pointer text-gray-300 px-2"
    >
      <FaPaperclip style={{color:"goldenrod"}} className="text-2xl" />
    </label>

    <button type="submit" className="text-gray-300 px-2">
      <FaPaperPlane style={{color:"greenyellow"}} className="text-2xl from-green-500" />
    </button>
  </form>

  {showPreview && (
    <FilePreviewPopover
      className="bg-gradient-to-r from-green-500 via-green-600 to-green-700"
      file={file}
      messageInput={messageInput}
      setMessageInput={setMessageInput}
      onSend={handleSubmit}
      onCancel={handleCancel}
      isLoading={isLoading}
    />
  )}
</div>

  
  );
};

export default ChatRoom;  
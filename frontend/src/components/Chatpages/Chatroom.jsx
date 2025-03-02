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
import './customEmojiPicker.css';
import { MdTextSnippet } from 'react-icons/md';
import { initializeSocket } from '../../socket/socket';

const ChatRoom = () => {
  const params = useParams();
  const respon = JSON.parse(localStorage.getItem('userInfo'));
  const socketConnection = initializeSocket(respon?.token);
  const user = useSelector((state) => state?.user);
  
  const [userData, setUserData] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [file, setFile] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [Allmessage, setAllmessage] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const chatThreadRef = useRef(null);

  // Scroll chat to bottom when new messages arrive
  useEffect(() => {
    if (chatThreadRef.current) {
      chatThreadRef.current.scrollTop = chatThreadRef.current.scrollHeight;
    }
  }, [Allmessage]);

  // Function to send a message
  const handleSubmit = async (e) => {
    e.preventDefault();
    let fileurl = null;

    if (file) {
      fileurl = await handleFileUpload();
    }

    if (messageInput.trim() !== "" || fileurl) {
      const newMessage = {
        text: messageInput.trim() || "",
        fileUrl: fileurl || "",
        type: "sent",
        senderId: user?.users[0]?.data._id,
        receiverId: params.id,
        timeStamp: new Date().toISOString(),
        msgByUserId: user?.users[0].data._id,
      };

      setAllmessage((prevMessages) => [...prevMessages, newMessage]);

      if (socketConnection) {
        console.log("🔹 Emitting message:", newMessage);
        socketConnection.emit("newmessages", newMessage);
      }

      setMessageInput("");
      setFile(null);
    }
  };

  // Function to upload a file
  const handleFileUpload = async () => {
    if (file) {
      setIsLoading(true);
      try {
        const storage = getStorage(app);
        const storageRef = ref(storage, "chatApp/" + file.name);
        await uploadBytes(storageRef, file);
        const downloadUrl = await getDownloadURL(storageRef);
        setShowPreview(false);
        setIsLoading(false);
        return downloadUrl;
      } catch (error) {
        console.error("File upload error:", error);
        setIsLoading(false);
        toast.error("Something went wrong");
      }
    }
  };

  // Function to listen for socket events
  useEffect(() => {
    if (socketConnection) {
      console.log("🔹 Socket Connected");

      socketConnection.on("prevmessages", (data) => {
        setAllmessage(data);
      });

      socketConnection.on("newmessages", (newMessage) => {
        console.log("🔹 New message received:", newMessage);
        setAllmessage((prevMessages) => [...prevMessages, newMessage]);
      });

      socketConnection.emit("message", params.id);
      socketConnection.on("isonline", (data) => {
        console.log("🔹 User online status:", data);
        setUserData(data);
      });

      socketConnection.emit("seen", params.id);

      return () => {
        socketConnection.off("prevmessages");
        socketConnection.off("isonline");
        socketConnection.off("seen");
        socketConnection.off("message");
        socketConnection.off("newmessages");
      };
    }
  }, [socketConnection, params.id,Allmessage,userData]);

  return (
    <div className="flex flex-col h-full bg-gradient-to-r from-gray-800 via-black to-gray-900">
      {userData && (
        <div className="w-full bg-gradient-to-r from-gray-900 to-gray-700 h-[55px] rounded-md">
          <div className="flex items-center p-2 rounded-lg">
            <img
              src={userData.profile_pic}
              alt={userData.name}
              className="w-12 h-12 rounded-full object-cover mr-3 border-2 border-gray-600"
            />
            <div className="flex flex-col">
              <p className="font-medium text-gray-100">{userData.name}</p>
              <p className="text-sm text-gray-500">
                {userData.online ? "Online" : "Offline"}
              </p>
            </div>
          </div>
        </div>
      )}

      <ul
        className="chat-thread flex-grow p-4 space-y-4 overflow-y-auto"
        style={{ height: "calc(100vh - 64px)" }}
        ref={chatThreadRef}
      >
        {Allmessage.map((message, index) => (
          <li
            key={index}
            className={`relative flex flex-col py-2 px-4 rounded-lg text-sm max-w-[90%] md:max-w-[70%] ${
              user?.users[0]?.data._id !== message.msgByUserId
                ? "mr-auto bg-gray-500 text-black"
                : "ml-auto bg-teal-600 text-white"
            }`}
          >
            {message.fileUrl && (
              <div className="w-full max-h-96 rounded-md mb-1">
                {message.fileUrl.includes(".mp4") ? (
                  <video
                    src={message.fileUrl}
                    controls
                    className="w-full h-96 rounded-md object-cover"
                  />
                ) : (
                  <img
                    src={message.fileUrl}
                    alt="Uploaded file"
                    className="w-full h-auto rounded-md object-cover"
                  />
                )}
              </div>
            )}
            {message.text && <span className="text-sm">{message.text}</span>}
            <p className="absolute bottom-1 right-2 text-xs text-gray-400">
              {moment(message.createdAt).format("hh:mm A")}
            </p>
          </li>
        ))}
      </ul>

      <form
        onSubmit={handleSubmit}
        className="flex items-center w-full p-4 bg-gray-800"
      >
        <button type="button" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
          <FaSmile className="text-2xl text-yellow-400" />
        </button>

        <input
          className="flex-grow px-4 py-2 text-lg bg-white border-b-2 border-gray-400 text-gray-700 outline-none"
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          placeholder="Type a message..."
          autoComplete="off"
        />

        <input type="file" id="fileInput" style={{ display: "none" }} onChange={(e) => setFile(e.target.files[0])} />
        <label htmlFor="fileInput">
          <FaPaperclip className="text-2xl text-goldenrod" />
        </label>

        <button type="submit">
          <FaPaperPlane className="text-2xl text-green-500" />
        </button>
      </form>
    </div>
  );
};

export default ChatRoom;

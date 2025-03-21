import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { MdTextSnippet } from "react-icons/md"; // For text file icon
import { FaVideo } from "react-icons/fa"; // For video file icon
import { AiFillFileImage } from "react-icons/ai";
import * as openpgp from 'openpgp';
import { initializeSocket,disconnectSocket } from "../../socket/socket";

const ConversationList = () => {
  const navigate = useNavigate();
  const [allUser, setAllUser] = useState([]);
  const handleChatClick = (id) => {
    navigate(`/chat/${id}`);
  };
  const respon = JSON.parse(localStorage.getItem('userInfo'));
  const socketConnection = initializeSocket(respon.token);

  const user = useSelector((state) => state?.user?.users[0]?.data?._id);
  // console.log(user)

  useEffect(() => {
    if (socketConnection && user) {
      // Set up the event listener first
      const handleConversationUpdate = (data) => {
        setAllUser(data);
        // console.log("Updated Conversations:", data);
      };
  
      socketConnection.on("conversation", handleConversationUpdate);
  
      // Now emit after listener is set
      socketConnection.emit("sidebar", user);
  
      return () => {
        socketConnection.off("conversation", handleConversationUpdate); // Remove listener to prevent duplicates
      };
    }
  }, [socketConnection, user,allUser]); // Keeping allUser if necessary
  

  // const decryptConversations = async (conversations) => {
  //   const decryptedConversations = await Promise.all(
  //     conversations.map(async (conversation) => {
  //       const decryptedLastMsg = await decrypt(conversation.lastMsg);
  //       return {
  //         ...conversation,
  //         lastMsg: {
  //           ...conversation.lastMsg,
  //           ...decryptedLastMsg, // Update only text and fileUrl in lastMsg
  //         },
  //       };
  //     })
  //   );
  //   setAllUser(decryptedConversations);
  // };

  // const decrypt=async(msg)=>{
  //       const decryptedText = await openpgp.decrypt({
  //         message: await openpgp.readMessage({ armoredMessage: msg.text }),
  //         decryptionKeys: await openpgp.readPrivateKey({ armoredKey: privateKey }),
  //       });
  //       const decryptedFileUrl = await openpgp.decrypt({
  //         message: await openpgp.readMessage({ armoredMessage: msg.fileUrl }),
  //         decryptionKeys: await openpgp.readPrivateKey({ armoredKey: privateKey }),
  //     });
  //     return {
  //       text: decryptedText.data,
  //       fileUrl: decryptedFileUrl.data
  //     }
  //   }

  return (
    <div className="p-4 bg-gradient-to-b from-gray-900 to-black text-white">
      <h2 className="text-xl font-semibold mb-4">Chats</h2>
      <ul>
        {/* {console.log(allUser)} */}
        {allUser
          .filter((user) => user.sender != null)
          .map((conversation, index) => (
            <div
              key={index}
              className="flex items-center mb-4 p-3 rounded-lg bg-gradient-to-r from-gray-800 via-black to-gray-800 shadow-md hover:bg-gradient-radial hover:from-gray-700 hover:via-gray-900 hover:to-gray-700 cursor-pointer transition duration-300 ease-in-out transform hover:scale-105"
              onClick={() => handleChatClick(conversation.receiver._id)}
            >
              {/* {console.log(conversation)} */}
              <div className="mr-4 w-12">
                <img
                  src={conversation.receiver.profile_pic}
                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-600"
                  alt={`${conversation.receiver.name}'s profile`}
                />
              </div>
              <li className="flex-1">
                <h3 className="font-bold text-white">
                  {conversation.receiver.name}
                </h3>
                
                {conversation?.lastMsg?.fileUrl && (
                  <>
                    {conversation?.lastMsg?.fileUrl.includes(".mp4") ? (
                      <div className="flex items-center bg-gray-800 rounded-md p-2">
                        <FaVideo className="text-red-600 mr-2" size={24} />
                        <span className="text-gray-700">Video Message</span>
                      </div>
                    ) : conversation?.lastMsg?.fileUrl.includes(".txt") ? (
                      <a
                        href={conversation?.lastMsg?.fileUrl}
                        className="flex items-center bg-gray-800 rounded-md p-2 hover:bg-gray-400 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MdTextSnippet
                          className="text-blue-600 mr-2"
                          size={24}
                        />
                        <span className="text-gray-700">
                          Download Text File
                        </span>
                      </a>
                    ) : (
                      <div className="flex items-center bg-gray-600 rounded-md p-2">
                        <AiFillFileImage
                          className="text-green-600 mr-2"
                          size={24}
                        />
                        <span className="text-gray-700">Image Message</span>
                      </div>
                    )}
                  </>
                )}
                {conversation?.lastMsg?.text && (
                  <p className="text-gray-400 text-sm text-ellipsis line-clamp-1" style={{overflow:"hidden"}}> 
                  {/* //line-clamp-1 text-ellipsis */}
                    {conversation?.lastMsg?.text}
                  </p>
                )}
              </li>
              <div className="relative ml-7">
                {conversation?.unSeenmsg > 0 && ( // Only show if there are unseen messages
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-green-500 border-2 border-white rounded-full">
                    {conversation?.unSeenmsg}
                  </span>
                )}
              </div>
            </div>
          ))}
      </ul>
    </div>
  );
};

export default ConversationList;

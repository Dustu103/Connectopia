import { io } from "socket.io-client";

let socket = null;

export const getSocket = () => socket;

export const initializeSocket = (token) => {
  // console
  if (token !== ""  && !socket) {
     // Get the token from storage
     console.log(token)
    socket = io(process.env.REACT_APP_SOCKET_URL, {
      withCredentials: true,
      auth: {
        token: token|| "", // Pass token for authentication
      },
    });

    socket.on("connect", () => {
      console.log("Connected to WebSocket");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket");
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

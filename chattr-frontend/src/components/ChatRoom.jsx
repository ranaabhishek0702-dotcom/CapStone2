import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { connectSocket } from "../socket";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

export default function ChatRoom() {
  const { channelId } = useParams();
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);

  const room = channelId || "general"; // Use channelId from params, fallback to "general"

  useEffect(() => {
    // Check auth
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    const s = connectSocket();
    setSocket(s);
    socketRef.current = s;

    s.on("connect", () => {
      console.log("Socket connected");
      setIsConnected(true);
      s.emit("joinRoom", room);
    });

    s.on("disconnect", () => {
      console.log("Socket disconnected");
      setIsConnected(false);
    });

    s.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      setIsConnected(false);
    });

    s.on("chatHistory", (history) => {
      setMessages(history);
    });

    s.on("receiveMessage", (msg) => {
      setMessages((prev) => {
        // Avoid duplicates
        const exists = prev.some(m => 
          m.time === msg.time && 
          m.sender === msg.sender && 
          m.message === msg.message
        );
        if (exists) return prev;
        return [...prev, msg];
      });
    });

    return () => {
      if (s) {
        s.disconnect();
      }
      socketRef.current = null;
    };
  }, [room, navigate]);

  const sendMessage = useCallback((msg) => {
    const currentSocket = socketRef.current;
    
    if (!currentSocket || !isConnected) {
      console.error("Socket not connected");
      return;
    }

    const username = localStorage.getItem("username");
    if (!username) {
      console.error("No username found");
      return;
    }

    // Optimistically add message to UI
    const tempMessage = {
      sender: username,
      message: msg,
      room: room,
      time: Date.now()
    };
    
    setMessages((prev) => [...prev, tempMessage]);

    // Send to server
    currentSocket.emit("sendMessage", {
      sender: username,
      message: msg,
      room: room,
    });
  }, [isConnected, room]);

  const handleLeaveChannel = () => {
    navigate("/dashboard");
  };

  return (
    <div className="App">
      <div className="app-container">
        <div className="chat-room">
          <div className="chat-header">
            <div className="chat-header-left">
              <h1>Chattr</h1>
              <div className="room-info">
                <div className={`status-indicator ${isConnected ? '' : 'disconnected'}`}></div>
                <span>#{room}</span>
              </div>
            </div>
            <button className="leave-channel-btn" onClick={handleLeaveChannel}>
              ← Back to Channels
            </button>
          </div>
          <MessageList messages={messages} />
          <MessageInput onSend={sendMessage} socket={socket} />
        </div>
      </div>
    </div>
  );
}

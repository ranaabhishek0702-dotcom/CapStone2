import { useState, useEffect, useRef } from 'react';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentRoom, setCurrentRoom] = useState('general');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const { socket, connected } = useSocket();
  const { user } = useAuth();

  useEffect(() => {
    if (!socket || !connected) return;

    // Join the default room
    socket.emit('joinRoom', currentRoom);

    // Listen for chat history
    socket.on('chatHistory', (history) => {
      setMessages(history);
    });

    // Listen for new messages
    socket.on('receiveMessage', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    // Listen for user joined
    socket.on('userJoined', ({ user: joinedUser }) => {
      const systemMessage = {
        sender: 'System',
        message: `${joinedUser} joined the chat`,
        time: Date.now(),
        isSystem: true
      };
      setMessages((prev) => [...prev, systemMessage]);
    });

    // Listen for user left
    socket.on('userLeft', ({ user: leftUser }) => {
      const systemMessage = {
        sender: 'System',
        message: `${leftUser} left the chat`,
        time: Date.now(),
        isSystem: true
      };
      setMessages((prev) => [...prev, systemMessage]);
    });

    // Listen for typing indicator
    socket.on('userTyping', ({ user: typingUser, isTyping }) => {
      if (isTyping) {
        setTypingUsers((prev) => [...new Set([...prev, typingUser])]);
      } else {
        setTypingUsers((prev) => prev.filter((u) => u !== typingUser));
      }
    });

    return () => {
      socket.off('chatHistory');
      socket.off('receiveMessage');
      socket.off('userJoined');
      socket.off('userLeft');
      socket.off('userTyping');
    };
  }, [socket, connected, currentRoom]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket || !connected) return;

    const messageData = {
      sender: user?.username || 'Anonymous',
      message: newMessage,
      room: currentRoom,
      time: Date.now()
    };

    socket.emit('sendMessage', messageData);
    setNewMessage('');
    handleTyping(false);
  };

  const handleTyping = (typing) => {
    if (!socket || !connected) return;

    setIsTyping(typing);
    socket.emit('typing', { room: currentRoom, isTyping: typing });

    if (typing) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        handleTyping(false);
      }, 1000);
    }
  };

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    if (!isTyping && e.target.value) {
      handleTyping(true);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 rounded-t-xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              #{currentRoom}
            </h3>
            <div className="flex items-center mt-1">
              <div className={`h-2 w-2 rounded-full mr-2 ${connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <p className="text-xs text-gray-500">
                {connected ? 'Connected' : 'Disconnected'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 mt-8">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={msg.isSystem ? 'text-center' : ''}
            >
              {msg.isSystem ? (
                <p className="text-xs text-gray-400 italic">{msg.message}</p>
              ) : (
                <div className={`flex ${msg.sender === user?.username ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-xs lg:max-w-md xl:max-w-lg ${msg.sender === user?.username
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                      } rounded-lg px-4 py-2`}
                  >
                    {msg.sender !== user?.username && (
                      <p className="text-xs font-semibold mb-1 text-primary-600">
                        {msg.sender}
                      </p>
                    )}
                    <p className="text-sm break-words">{msg.message}</p>
                    <p
                      className={`text-xs mt-1 ${msg.sender === user?.username ? 'text-primary-100' : 'text-gray-500'
                        }`}
                    >
                      {formatTime(msg.time)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />

        {/* Typing indicator */}
        {typingUsers.length > 0 && (
          <div className="text-sm text-gray-400 italic">
            {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
          </div>
        )}
      </div>

      {/* Input */}
      <div className="px-6 py-4 border-t border-gray-100">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={handleInputChange}
            placeholder="Type a message..."
            disabled={!connected}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={!connected || !newMessage.trim()}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;

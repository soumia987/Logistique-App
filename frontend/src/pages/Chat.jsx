import React from 'react';
import ChatContainer from '../chat/ChatContainer';
import { SocketProvider } from '../context/SocketContext';

const Chat = () => {
  return (
    <SocketProvider>
      <div className="flex h-screen antialiased text-gray-800">
        <div className="flex flex-row h-full w-full overflow-x-hidden">
          <ChatContainer />
        </div>
      </div>
    </SocketProvider>
  );
};

export default Chat;

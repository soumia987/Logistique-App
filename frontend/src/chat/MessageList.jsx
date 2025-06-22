import React, { useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';

const MessageList = ({ messages }) => {
    const { user } = useAuth();
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    return (
        <div className="flex flex-col h-full overflow-x-auto mb-4">
            <div className="flex flex-col h-full">
                <div className="grid grid-cols-12 gap-y-2">
                    {messages.map((message) => {
                        const isMyMessage = message.sender._id === user.id;
                        return (
                            <div key={message._id} className={`col-start-${isMyMessage ? '6' : '1'} col-end-${isMyMessage ? '13' : '8'} p-3 rounded-lg`}>
                                <div className={`flex items-center ${isMyMessage ? 'justify-start flex-row-reverse' : 'flex-row'}`}>
                                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                                       {message.sender.prenom[0]}
                                    </div>
                                    <div className={`relative ${isMyMessage ? 'mr-3' : 'ml-3'} text-sm bg-white py-2 px-4 shadow rounded-xl`}>
                                        <div>{message.content}</div>
                                        <div className="absolute text-xs bottom-0 right-0 -mb-5 mr-2 text-gray-500">
                                            {format(new Date(message.createdAt), 'p')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                     <div ref={messagesEndRef} />
                </div>
            </div>
        </div>
    );
};

export default MessageList;

import React, { useState, useEffect } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput.jsx';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api'; 
import toast from 'react-hot-toast';

const ChatContainer = () => {
    const { socket } = useSocket();
    const { user } = useAuth();
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const response = await userAPI.getConversations();
                setConversations(response.data);
                if (response.data.length > 0) {
                    setSelectedConversation(response.data[0]);
                }
            } catch (error) {
                toast.error("Erreur lors de la récupération des conversations.");
            }
        };

        if(user) {
            fetchConversations();
        }
    }, [user]);

    useEffect(() => {
        if (selectedConversation) {
            socket?.emit('join_conversation', selectedConversation._id);
            // Charger les messages de la conversation
            const fetchMessages = async () => {
                try {
                    const response = await userAPI.getMessages(selectedConversation._id);
                    setMessages(response.data);
                } catch (error) {
                    toast.error("Erreur lors du chargement des messages.");
                }
            };
            fetchMessages();
        }

        const handleNewMessage = (newMessage) => {
            if (newMessage.conversation === selectedConversation?._id) {
                setMessages((prevMessages) => [...prevMessages, newMessage]);
            }
        };

        socket?.on('new_message', handleNewMessage);

        return () => {
            socket?.off('new_message', handleNewMessage);
        };
    }, [socket, selectedConversation]);

    const handleSendMessage = (content) => {
        if (socket && selectedConversation) {
            const messageData = {
                conversation: selectedConversation._id,
                sender: user.id,
                content: content,
            };
            socket.emit('send_message', messageData);
        }
    };
    
    const getOtherParticipant = (participants) => {
        return participants.find(p => p._id !== user.id);
    }

    return (
        <>
            {/* Sidebar avec la liste des conversations */}
            <div className="flex flex-col py-8 pl-6 pr-2 w-64 bg-white flex-shrink-0">
                <div className="flex flex-row items-center justify-center h-12 w-full">
                    <div className="flex items-center justify-center rounded-2xl text-indigo-700 bg-indigo-100 h-10 w-10">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                        </svg>
                    </div>
                    <div className="ml-2 font-bold text-2xl">Messages</div>
                </div>
                <div className="flex flex-col mt-8">
                    <div className="flex flex-row items-center justify-between text-xs">
                        <span className="font-bold">Conversations Actives</span>
                        <span className="flex items-center justify-center bg-gray-300 h-4 w-4 rounded-full">{conversations.length}</span>
                    </div>
                    <div className="flex flex-col space-y-1 mt-4 -mx-2 h-full overflow-y-auto">
                        {conversations.map((conv) => {
                             const otherUser = getOtherParticipant(conv.participants);
                             return (
                                <button key={conv._id} onClick={() => setSelectedConversation(conv)}
                                    className={`flex flex-row items-center hover:bg-gray-100 rounded-xl p-2 ${selectedConversation?._id === conv._id ? 'bg-gray-100' : ''}`}>
                                    <div className="flex items-center justify-center h-8 w-8 bg-indigo-200 rounded-full">
                                      {otherUser?.prenom[0]}
                                    </div>
                                    <div className="ml-2 text-sm font-semibold">{otherUser?.prenom} {otherUser?.nom}</div>
                                </button>
                             )
                        })}
                    </div>
                </div>
            </div>
            {/* Section principale du chat */}
            <div className="flex flex-col flex-auto h-full p-6">
                <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-100 h-full p-4">
                     {selectedConversation ? (
                        <>
                            <MessageList messages={messages} />
                            <MessageInput onSendMessage={handleSendMessage} />
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-gray-500">Sélectionnez une conversation pour commencer à discuter.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default ChatContainer;

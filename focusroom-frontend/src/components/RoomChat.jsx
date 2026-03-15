import React, { useRef, useEffect } from 'react';
import { useUserCache } from '../context/UserContext';

const RoomChat = ({ messages, newMessage, setNewMessage, sendChatMessage, connected, user }) => {
    const messagesEndRef = useRef(null);
    const { userCache, loadUsers } = useUserCache();
    const API_BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8080';

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        const userIds = [...new Set(messages.map(m => m.userId))];
        if (userIds.length > 0) loadUsers(userIds);
    }, [messages]);

    return (
        <div className="flex flex-col h-full bg-transparent">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-200">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                        </div>
                        <p className="text-gray-400 text-sm">No messages yet.</p>
                    </div>
                ) : (
                    messages.map((msg, index) => {
                        const isOwn = msg.userId === user?.userId;
                        const cachedUser = userCache[msg.userId];

                        return (
                            <div key={index} className={`flex items-start gap-2.5 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
                                <div className="shrink-0 mt-0.5">
                                    <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold text-xs overflow-hidden">
                                        {cachedUser?.profileImageUrl ? (
                                            <img src={`${API_BASE_URL}${cachedUser.profileImageUrl}`} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            msg.userName?.charAt(0).toUpperCase()
                                        )}
                                    </div>
                                </div>
                                
                                <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} max-w-[80%]`}>
                                    <div className="flex items-center gap-2 mb-1 px-0.5">
                                        <span className="text-xs font-semibold text-gray-700">{msg.userName}</span>
                                        <span className="text-[10px] text-gray-400">
                                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <div className={`px-3 py-2 text-sm leading-relaxed transition-all duration-300 ${
                                        isOwn
                                            ? 'bg-red-500 text-white rounded-2xl rounded-tr-sm shadow-sm'
                                            : 'bg-white text-black border border-gray-200 rounded-2xl rounded-tl-sm shadow-sm'
                                    }`}>
                                        {msg.message}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Wrapper */}
            <div className="p-4 bg-white border-t border-gray-100">
                <form onSubmit={sendChatMessage} className="relative flex items-center">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder={connected ? "Type a message..." : "Connecting..."}
                        disabled={!connected}
                        className="w-full pl-4 pr-12 py-2.5 bg-gray-50 border border-gray-200 rounded-full text-sm text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all disabled:opacity-50"
                    />
                    <button
                        type="submit"
                        disabled={!connected || !newMessage.trim()}
                        className={`absolute right-1.5 p-1.5 rounded-full transition-all flex items-center justify-center ${
                            connected && newMessage.trim()
                                ? 'bg-red-500 text-white hover:bg-red-600'
                                : 'bg-transparent text-gray-300'
                        }`}
                    >
                        <svg className="w-4 h-4 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RoomChat;

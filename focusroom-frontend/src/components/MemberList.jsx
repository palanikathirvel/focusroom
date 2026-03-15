import React, { useEffect } from 'react';
import { useUserCache } from '../context/UserContext';

const statusConfig = {
    STUDYING: { dot: 'bg-green-500', label: 'Studying', bg: 'bg-green-100', text: 'text-green-700' },
    BREAK: { dot: 'bg-yellow-400', label: 'Break', bg: 'bg-yellow-100', text: 'text-yellow-700' },
    PAUSED: { dot: 'bg-gray-400', label: 'Paused', bg: 'bg-gray-100', text: 'text-gray-600' },
    CANCELLED: { dot: 'bg-red-500', label: 'Away', bg: 'bg-red-100', text: 'text-red-700' },
};

const MemberList = ({ members }) => {
    const { userCache, loadUsers } = useUserCache();
    const API_BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8080';

    useEffect(() => {
        const userIds = members.map(m => m.userId);
        if (userIds.length > 0) loadUsers(userIds);
    }, [members]);

    return (
        <div className="flex flex-col space-y-1">
            {members.length > 0 ? (
                members.map((member) => {
                    const cachedUser = userCache[member.userId];
                    const status = statusConfig[member.status] || statusConfig.CANCELLED;
                    return (
                        <div
                            key={member.userId}
                            className="flex items-center gap-3 p-2.5 rounded-xl transition-all hover:bg-gray-50 group border border-transparent shadow-sm hover:border-gray-200"
                        >
                            <div className="relative shrink-0">
                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 font-bold text-sm overflow-hidden border border-gray-200 group-hover:bg-red-500 group-hover:text-white transition-colors">
                                    {cachedUser?.profileImageUrl ? (
                                        <img src={`${API_BASE_URL}${cachedUser.profileImageUrl}`} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        member.userName?.charAt(0).toUpperCase()
                                    )}
                                </div>
                                <div className={`absolute bottom-0 right-0 w-3 h-3 ${status.dot} border-2 border-white rounded-full shadow-sm`}></div>
                            </div>
                            
                            <div className="flex-1 min-w-0 flex flex-col justify-center">
                                <p className="text-sm font-semibold text-black truncate group-hover:text-red-500 transition-colors">{member.userName}</p>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${status.bg} ${status.text}`}>
                                        {status.label}
                                    </span>
                                    {member.focusTime > 0 && (
                                        <span className="text-[10px] font-medium text-gray-500">{member.focusTime}m focus</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })
            ) : (
                <div className="text-center py-8">
                    <p className="text-xs text-gray-400">No members found</p>
                </div>
            )}
        </div>
    );
};

export default MemberList;

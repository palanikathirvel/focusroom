import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUserCache } from '../context/UserContext';
import { roomService } from '../services/roomService';
import { sessionService } from '../services/sessionService';
import { leaderboardService } from '../services/leaderboardService';
import { noteService } from '../services/noteService';
import { chatService } from '../services/chatService';
import { useStompClient } from '../hooks/useStompClient';
import MemberList from '../components/MemberList';
import GroupLeaderboard from '../components/GroupLeaderboard';
import RoomChat from '../components/RoomChat';
import NotesSharingPanel from '../components/NotesSharingPanel';
import MotivationalQuote from '../components/MotivationalQuote';

const StudyRoomPage = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { loadUsers, getUserName } = useUserCache();

    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isMember, setIsMember] = useState(false);
    const isMemberRef = useRef(isMember);

    useEffect(() => { isMemberRef.current = isMember; }, [isMember]);

    const [roomMembers, setRoomMembers] = useState([]);
    const [roomLeaderboard, setRoomLeaderboard] = useState([]);
    const [roomNotes, setRoomNotes] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    const [activeSession, setActiveSession] = useState(null);
    const [sessionTime, setSessionTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [sessionMode, setSessionMode] = useState('focus');

    const { connected, chatMessages, setChatMessages, memberUpdate, leaderboardUpdate, roomEvent, send: sendWS } = useStompClient(roomId);

    const focusTimeSeconds = (room?.focusDuration || 25) * 60;
    const breakTimeSeconds = (room?.breakDuration || 5) * 60;

    useEffect(() => {
        const initRoom = async () => {
            await loadRoom();
            await checkMembership();
            await loadActiveSession();
            await loadInitialData();
        };
        initRoom();
    }, [roomId]);

    useEffect(() => {
        const leaveOnUnload = () => {
            if (roomId && user?.userId && isMemberRef.current) {
                const token = localStorage.getItem('token');
                if (token) {
                    fetch(`${import.meta.env.VITE_API_URL}/rooms/${roomId}/leave`, {
                        method: 'DELETE',
                        headers: { 'Authorization': `Bearer ${token}`, 'X-User-Id': user.userId },
                        keepalive: true
                    }).catch(() => {});
                }
            }
        };
        window.addEventListener('beforeunload', leaveOnUnload);
        return () => { window.removeEventListener('beforeunload', leaveOnUnload); leaveOnUnload(); };
    }, [roomId, user?.userId]);

    useEffect(() => {
        if (memberUpdate) {
            setRoomMembers(prev => {
                const index = prev.findIndex(m => m.userId === memberUpdate.userId);
                if (index !== -1) {
                    const newMembers = [...prev];
                    newMembers[index] = memberUpdate;
                    return newMembers;
                }
                return [...prev, memberUpdate];
            });
        }
    }, [memberUpdate]);

    useEffect(() => { if (leaderboardUpdate) loadLeaderboard(); }, [leaderboardUpdate]);
    useEffect(() => {
        if (roomEvent?.type === 'ROOM_DELETED') {
            alert('Room deleted by creator.');
            navigate('/rooms');
        }
    }, [roomEvent]);

    const loadInitialData = async () => {
        try {
            const [members, leaderboard, notes, chatHistory] = await Promise.all([
                roomService.getRoomMembers(roomId),
                leaderboardService.getRoomLeaderboard(roomId),
                noteService.getRoomNotes(roomId),
                chatService.getChatHistory(roomId)
            ]);
            setRoomMembers(members);
            setRoomLeaderboard(leaderboard);
            setRoomNotes(notes);
            setChatMessages(chatHistory);
        } catch (error) { console.error('Data load failed'); }
    };

    const loadLeaderboard = async () => {
        try {
            const leaderboard = await leaderboardService.getRoomLeaderboard(roomId);
            setRoomLeaderboard(leaderboard);
        } catch (error) {}
    };

    const handleUploadNote = async (file) => {
        const newNote = await noteService.uploadNote(roomId, file, user.userId, user.name);
        setRoomNotes(prev => [newNote, ...prev]);
    };

    const sendChatMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !connected) return;
        sendWS(`/app/chat.sendMessage`, {
            roomId, userId: user.userId, userName: user.name,
            message: newMessage, timestamp: new Date()
        });
        setNewMessage('');
    };

    useEffect(() => {
        let interval = null;
        if (isRunning && sessionTime > 0) {
            interval = setInterval(() => setSessionTime(prev => prev - 1), 1000);
        } else if (sessionTime === 0 && isRunning) {
            handleSessionComplete();
        }
        return () => clearInterval(interval);
    }, [isRunning, sessionTime]);

    const loadRoom = async () => {
        try {
            const data = await roomService.getRoomById(roomId);
            setRoom(data);
        } catch (error) { navigate('/rooms'); }
        finally { setLoading(false); }
    };

    const checkMembership = async () => {
        const data = await roomService.checkMember(roomId);
        setIsMember(data.isMember);
    };

    const loadActiveSession = async () => {
        const session = await sessionService.getActiveSession(user.userId);
        if (session && session.roomId === roomId) {
            setActiveSession(session);
            setIsRunning(session.status === 'ACTIVE');
            setSessionTime(focusTimeSeconds); // Simplified for now
        }
    };

    const handleJoinRoom = async () => {
        try {
            await roomService.joinRoom(roomId);
            setIsMember(true);
            loadInitialData();
            loadRoom();
        } catch (error) {
            // If already a member or other error, try to load data anyway as a fallback
            setIsMember(true); 
            loadInitialData();
            loadRoom();
        }
    };

    const handleStartSession = async () => {
        const session = await sessionService.startSession(roomId);
        setActiveSession(session);
        setSessionTime(focusTimeSeconds);
        setIsRunning(true);
        setSessionMode('focus');
    };

    const handlePauseSession = async () => {
        if (activeSession) {
            await sessionService.pauseSession(activeSession.sessionId);
            setIsRunning(false);
            setActiveSession(prev => ({ ...prev, status: 'PAUSED' }));
        }
    };

    const handleResumeSession = async () => {
        if (activeSession) {
            await sessionService.resumeSession(activeSession.sessionId);
            setIsRunning(true);
            setActiveSession(prev => ({ ...prev, status: 'ACTIVE' }));
        }
    };

    const handleEndSession = async () => {
        if (activeSession) {
            await sessionService.endSession(activeSession.sessionId);
            setActiveSession(null);
            setIsRunning(false);
            setSessionTime(0);
            loadLeaderboard();
        }
    };

    const handleSessionComplete = () => {
        setIsRunning(false);
        if (sessionMode === 'focus') {
            setSessionMode('break');
            setSessionTime(breakTimeSeconds);
        } else {
            handleEndSession();
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const progress = sessionMode === 'focus'
        ? ((focusTimeSeconds - sessionTime) / focusTimeSeconds) * 100
        : ((breakTimeSeconds - sessionTime) / breakTimeSeconds) * 100;

    const isCreator = room?.createdBy === user?.userId;

    if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div></div>;

    return (
        <div className="space-y-6 h-full flex flex-col animate-in fade-in duration-500">
            {/* Minimal Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between bg-white border-b border-gray-200 pb-4 gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center text-white shadow-sm shrink-0">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5S19.832 5.477 21 6.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-black leading-tight mb-0.5">{room?.roomName}</h1>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Active Workspace</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button onClick={() => { navigator.clipboard.writeText(window.location.href); alert('Link copied!'); }} className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all text-sm font-medium border border-gray-200 shadow-sm" title="Copy Room Link">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                        <span>Share</span>
                    </button>
                    {isCreator && (
                        <button 
                            onClick={async () => { if(window.confirm('Dissolve this workspace?')) { await roomService.deleteRoom(roomId); navigate('/rooms'); }}} 
                            className="px-4 py-2 bg-white text-red-500 rounded-lg hover:bg-red-50 transition-all text-sm font-medium border border-red-200 shadow-sm"
                            title="Delete Room"
                        >
                            Delete
                        </button>
                    )}
                </div>
            </div>

            {isMember ? (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start flex-1 min-h-0 pb-10">
                    {/* Left Panel - Members */}
                    <div className="col-span-1 md:col-span-12 lg:col-span-3 flex flex-col gap-6 h-[400px] lg:h-full">
                        <div className="card-notion flex-1 overflow-hidden flex flex-col p-0">
                            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between shrink-0 bg-white">
                                <h3 className="text-sm font-semibold text-black">Members</h3>
                                <span className="px-2.5 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">{roomMembers.length} active</span>
                            </div>
                            <div className="overflow-y-auto flex-1 p-4">
                                <MemberList members={roomMembers} />
                            </div>
                        </div>
                        
                        <div className="card-notion p-5">
                             <h3 className="text-sm font-semibold text-black mb-4">Top Focusers</h3>
                             <GroupLeaderboard leaderboard={roomLeaderboard.slice(0, 3)} compact={true} />
                        </div>
                    </div>

                    {/* Center Panel - Study Timer */}
                    <div className="col-span-1 md:col-span-12 lg:col-span-6 flex flex-col gap-6 h-full min-h-[500px]">
                        <div className="card-notion flex-1 flex flex-col items-center justify-center py-10 relative group">
                            <div className="absolute top-5 left-5 z-10">
                                <span className={`text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full shadow-sm border ${sessionMode === 'focus' ? 'bg-red-100 text-red-700 border-red-200' : 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                                    {sessionMode === 'focus' ? 'Focus Session' : 'Break Time'}
                                </span>
                            </div>

                            {/* Pomodoro Timer Ring */}
                            <div className="relative w-64 h-64 mb-10 flex items-center justify-center">
                                <svg className="absolute inset-0 w-full h-full -rotate-90">
                                    <circle cx="128" cy="128" r="116" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-gray-100" />
                                    <circle 
                                        cx="128" cy="128" r="116" 
                                        fill="transparent" 
                                        stroke="currentColor" 
                                        strokeWidth="8" 
                                        strokeDasharray="728" 
                                        strokeDashoffset={728 - (728 * progress) / 100}
                                        strokeLinecap="round"
                                        className={`transition-all duration-1000 ${sessionMode === 'focus' ? 'text-red-500' : 'text-gray-400'}`} 
                                    />
                                </svg>
                                <div className="flex flex-col items-center justify-center z-10 absolute inset-0">
                                    <p className="text-6xl font-bold text-black tabular-nums tracking-tight">{formatTime(sessionTime)}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 w-full max-w-sm px-4">
                                {!activeSession ? (
                                    <button onClick={handleStartSession} className="w-full py-3 bg-red-500 text-white font-medium rounded-xl hover:bg-red-600 shadow-sm transition-all text-sm border-b-2 border-red-700 active:translate-y-[2px] active:border-b-0">
                                        Start Session
                                    </button>
                                ) : (
                                    <div className="flex gap-4 w-full">
                                        {isRunning ? (
                                            <button onClick={handlePauseSession} className="flex-1 py-3 bg-gray-200 text-black font-medium rounded-xl hover:bg-gray-300 transition-all text-sm">
                                                Pause
                                            </button>
                                        ) : (
                                            <button onClick={handleResumeSession} className="flex-1 py-3 bg-red-500 text-white font-medium rounded-xl hover:bg-red-600 transition-all text-sm">
                                                Resume
                                            </button>
                                        )}
                                        <button onClick={handleEndSession} className="px-6 py-3 bg-white text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all text-sm border border-gray-200 shadow-sm">
                                            Cancel
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="w-full h-1/3">
                            <NotesSharingPanel notes={roomNotes} onUpload={handleUploadNote} />
                        </div>
                    </div>

                    {/* Right Panel - Group Chat */}
                    <div className="col-span-1 md:col-span-12 lg:col-span-3 h-[500px] lg:h-full">
                        <div className="card-notion !p-0 overflow-hidden flex flex-col h-full relative border border-gray-200">
                            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between shrink-0 bg-white">
                                <h3 className="text-sm font-semibold text-black">Room Chat</h3>
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                    <span className="text-xs font-semibold text-gray-500">{connected ? 'Online' : 'Reconnecting'}</span>
                                </div>
                            </div>
                            <div className="flex-1 min-h-0 bg-gray-50/50">
                                <RoomChat
                                    messages={chatMessages}
                                    newMessage={newMessage}
                                    setNewMessage={setNewMessage}
                                    sendChatMessage={sendChatMessage}
                                    connected={connected}
                                    user={user}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-32 text-center card-notion">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    </div>
                    <h2 className="text-2xl font-bold text-black mb-3">Restricted Access</h2>
                    <p className="text-gray-500 max-w-sm mx-auto mb-8 text-sm">
                        You need to join this workspace to collaborate, chat, and synchronize your study timer with others.
                    </p>
                    <button onClick={handleJoinRoom} className="px-8 py-3 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 shadow-md transition-all text-sm">
                        Join Workspace
                    </button>
                </div>
            )}
        </div>
    );
};

export default StudyRoomPage;

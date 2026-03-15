import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { roomService } from '../services/roomService';
import { userService } from '../services/userService';
import { useAuth } from '../context/AuthContext';
import MotivationalQuote from '../components/MotivationalQuote';

const StudyRoomsPage = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newRoomName, setNewRoomName] = useState('');
    const [newRoomCapacity, setNewRoomCapacity] = useState(10);
    const [newFocusDuration, setNewFocusDuration] = useState(25);
    const [newBreakDuration, setNewBreakDuration] = useState(5);
    const [userNames, setUserNames] = useState({});
    const [search, setSearch] = useState('');
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => { loadRooms(); }, []);

    const loadRooms = async () => {
        try {
            const data = await roomService.getAllRooms();
            setRooms(data);
            const userIds = [];
            data.forEach(room => {
                if (room.createdBy && !userIds.includes(room.createdBy)) userIds.push(room.createdBy);
            });
            if (userIds.length > 0) {
                const users = await userService.getUsersByIds(userIds);
                const namesMap = {};
                users.forEach(u => { if (u) namesMap[u.userId] = u.name; });
                setUserNames(prev => ({ ...prev, ...namesMap }));
            }
        } catch (error) {
            console.error('Error loading rooms:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleJoinRoom = async (roomId) => {
        try {
            await roomService.joinRoom(roomId);
            navigate(`/room/${roomId}`);
        } catch (error) {
            // If already in room or other non-critical error, just navigate
            console.warn('Join attempted:', error);
            navigate(`/room/${roomId}`);
        }
    };

    const handleCreateRoom = async (e) => {
        e.preventDefault();
        try {
            const createdRoom = await roomService.createRoom(newRoomName, newRoomCapacity, newFocusDuration, newBreakDuration);
            setShowCreateModal(false);
            setNewRoomName('');
            loadRooms();
            navigate(`/room/${createdRoom.roomId}`);
        } catch (error) {
            alert('Failed to create room');
        }
    };

    const handleDeleteRoom = async (roomId) => {
        if (!window.confirm('Are you sure you want to delete this library forever?')) return;
        try {
            await roomService.deleteRoom(roomId);
            loadRooms();
        } catch (error) {
            alert('Failed to delete room');
        }
    };

    const filteredRooms = rooms.filter(r => 
        r.roomName?.toLowerCase().includes(search.toLowerCase()) || 
        r.roomId?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-4 border-b border-gray-100">
                <div>
                    <h1 className="text-3xl font-bold text-black tracking-tight mb-2">Study Rooms</h1>
                    <p className="text-gray-500 text-sm">Join an active session or create your own productivity space.</p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                    <div className="flex items-center bg-white border border-gray-300 rounded-xl px-4 py-2.5 w-full sm:w-64 focus-within:ring-2 focus-within:ring-red-500/20 focus-within:border-red-500 transition-all">
                        <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        <input 
                            type="text" 
                            placeholder="Find a room..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-transparent border-none text-sm text-black focus:outline-none w-full placeholder:text-gray-400" 
                        />
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="w-full sm:w-auto px-6 py-2.5 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-all shadow-sm flex items-center justify-center gap-2"
                    >
                        Create Room
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                    </button>
                </div>
            </div>

            <MotivationalQuote />

            {/* Room Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredRooms.map((room) => {
                    const isFull = room.members?.length >= room.maxMembers;
                    const fillPercent = Math.round(((room.members?.length || 0) / (room.maxMembers || 1)) * 100);

                    return (
                        <div key={room.roomId} className="card-notion flex flex-col h-full relative overflow-hidden">
                            {/* Visual Indicator */}
                            {room.createdBy === user?.userId && (
                                <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>
                            )}
                            
                            <div className="flex-1 flex flex-col">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="space-y-1 pr-4 min-w-0">
                                        <h3 className="text-xl font-bold text-black truncate">{room.roomName}</h3>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs text-gray-500 truncate">Host: {userNames[room.createdBy] || 'System'}</span>
                                            <span className="text-[10px] font-mono text-gray-400 select-all">ID: {room.roomId}</span>
                                        </div>
                                    </div>
                                    <div className={`shrink-0 flex items-center gap-2`}>
                                        {room.createdBy === user?.userId && (
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleDeleteRoom(room.roomId); }}
                                                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all"
                                                title="Delete Room"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        )}
                                        <div className={`px-3 py-1 rounded text-xs font-semibold ${isFull ? 'bg-gray-100 text-gray-500' : 'bg-green-100 text-green-700'}`}>
                                            {isFull ? 'Full' : 'Open'}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-6 mt-auto">
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                                        <div className="flex items-center gap-3">
                                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                            <div className="min-w-0">
                                                <p className="text-xs text-gray-500">Occupancy</p>
                                                <p className="text-sm font-bold text-black">{room.members?.length || 0} <span className="text-gray-400 font-normal">/ {room.maxMembers}</span></p>
                                            </div>
                                        </div>
                                        <div className="w-10 h-10 relative flex items-center justify-center">
                                            <svg className="w-full h-full -rotate-90">
                                                <circle cx="20" cy="20" r="16" fill="transparent" stroke="currentColor" strokeWidth="3" className="text-gray-200" />
                                                <circle cx="20" cy="20" r="16" fill="transparent" stroke="currentColor" strokeWidth="3.5" strokeDasharray={`${fillPercent} 100`} strokeLinecap="round" className={isFull ? "text-gray-400" : "text-green-500"} />
                                            </svg>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="p-3 bg-white border border-gray-200 rounded-xl">
                                            <p className="text-xs text-gray-500 mb-1">Focus</p>
                                            <p className="text-sm font-bold text-black">{room.focusDuration || 25}m</p>
                                        </div>
                                        <div className="p-3 bg-white border border-gray-200 rounded-xl">
                                            <p className="text-xs text-gray-500 mb-1">Break</p>
                                            <p className="text-sm font-bold text-black">{room.breakDuration || 5}m</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => handleJoinRoom(room.roomId)}
                                disabled={isFull}
                                className={`w-full py-3 px-4 text-sm font-medium rounded-lg transition-all ${
                                    isFull 
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                    : 'bg-white border border-gray-200 text-black hover:bg-gray-50 shadow-sm'
                                }`}
                            >
                                {isFull ? 'Room Full' : 'Join Room'}
                            </button>
                        </div>
                    );
                })}

                {filteredRooms.length === 0 && (
                    <div className="col-span-full py-16 text-center card-notion border-dashed bg-gray-50">
                        <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                        <h3 className="text-lg font-bold text-black mb-1">No rooms found</h3>
                        <p className="text-gray-500 text-sm">Create a new workspace to get started.</p>
                    </div>
                )}
            </div>

            {/* Create Room Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all">
                        <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-white text-black">
                            <div>
                                <h2 className="text-xl font-bold">Create Room</h2>
                                <p className="text-gray-500 text-xs mt-1">Setup your new productivity space</p>
                            </div>
                            <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-black transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <form onSubmit={handleCreateRoom} className="p-6 space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-gray-700">Room Name</label>
                                <input
                                    type="text"
                                    value={newRoomName}
                                    onChange={(e) => setNewRoomName(e.target.value)}
                                    placeholder="e.g. Deep Work Session"
                                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all placeholder:text-gray-400"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-gray-700">Focus Time</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={newFocusDuration}
                                            onChange={(e) => setNewFocusDuration(Number(e.target.value))}
                                            className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all pr-12"
                                            min="1"
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-500">Min</span>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-gray-700">Break Time</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={newBreakDuration}
                                            onChange={(e) => setNewBreakDuration(Number(e.target.value))}
                                            className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all pr-12"
                                            min="1"
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-500">Min</span>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-gray-700">Max Members</label>
                                <input
                                    type="number"
                                    value={newRoomCapacity}
                                    onChange={(e) => setNewRoomCapacity(Number(e.target.value))}
                                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                                    min="2"
                                    max="50"
                                />
                            </div>
                            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-gray-100">
                                <button type="button" onClick={() => setShowCreateModal(false)} className="w-full sm:flex-1 py-2.5 px-4 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors">Cancel</button>
                                <button type="submit" className="w-full sm:flex-1 py-2.5 px-4 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 shadow-md transition-all">Create Room</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudyRoomsPage;

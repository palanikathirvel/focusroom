import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { sessionService } from '../services/sessionService';
import { leaderboardService } from '../services/leaderboardService';
import { userService } from '../services/userService';

const ProfilePage = () => {
    const { user, logout, updateProfileImage } = useAuth();
    const [stats, setStats] = useState({
        totalFocusTime: 0,
        sessionsCompleted: 0,
        averageSessionLength: 0,
        rank: 0
    });
    const [loading, setLoading] = useState(true);
    const [activeSession, setActiveSession] = useState(null);
    const [sessionTime, setSessionTime] = useState(0);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    const API_BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8080';

    useEffect(() => {
        loadUserProfile();
        loadActiveSession();
    }, []);

    useEffect(() => {
        let interval = null;
        if (activeSession?.status === 'ACTIVE') {
            interval = setInterval(() => setSessionTime(prev => prev + 1), 1000);
        }
        return () => clearInterval(interval);
    }, [activeSession]);

    const loadUserProfile = async () => {
        try {
            const history = await sessionService.getSessionHistory(user.userId);
            const totalTime = history.reduce((sum, s) => sum + (s.focusDuration || 0), 0);
            const avgSession = history.length > 0 ? Math.round(totalTime / history.length) : 0;

            try {
                const leaderboardData = await leaderboardService.getLeaderboard();
                const userRank = leaderboardData.findIndex(u => u.userId === user.userId);
                setStats({
                    totalFocusTime: totalTime,
                    sessionsCompleted: history.length,
                    averageSessionLength: avgSession,
                    rank: userRank !== -1 ? userRank + 1 : 0
                });
            } catch {
                setStats(prev => ({ ...prev, totalFocusTime: totalTime, sessionsCompleted: history.length, averageSessionLength: avgSession }));
            }
        } catch (error) {
            console.error('Profile load error');
        } finally {
            setLoading(false);
        }
    };

    const loadActiveSession = async () => {
        try {
            const session = await sessionService.getActiveSession(user.userId);
            if (session?.status === 'ACTIVE') {
                setActiveSession(session);
                const elapsed = Math.floor((Date.now() - new Date(session.startTime).getTime()) / 1000);
                setSessionTime(elapsed);
            }
        } catch (error) {}
    };

    const handlePhotoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        try {
            const updatedUser = await userService.uploadProfilePhoto(user.userId, file);
            updateProfileImage(updatedUser.profileImageUrl);
        } catch (error) {
            alert('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const formatTime = (minutes) => {
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return h > 0 ? `${h}H ${m}M` : `${m}M`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            </div>
        );
    }

    const tier = stats.sessionsCompleted >= 50 ? 'Elite Scholar' :
                 stats.sessionsCompleted >= 20 ? 'Focused Learner' :
                 stats.sessionsCompleted >= 5  ? 'Study Buddy' : 'Beginner';
    
    const nextTierGoal = stats.sessionsCompleted < 5 ? 5 : stats.sessionsCompleted < 20 ? 20 : stats.sessionsCompleted < 50 ? 50 : 100;
    const progressPercent = Math.min(100, (stats.sessionsCompleted / nextTierGoal) * 100);

    return (
        <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Profile Header Card */}
            <div className="card-notion relative overflow-hidden flex flex-col md:flex-row items-center gap-8 group">
                {/* Visual Accent */}
                <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>

                <div className="relative shrink-0">
                    <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center text-gray-700 font-bold text-4xl overflow-hidden shadow-inner group-hover:scale-105 transition-transform duration-500 border-4 border-white">
                        {user?.profileImageUrl ? (
                            <img src={`${API_BASE_URL}${user.profileImageUrl}`} alt="" className="w-full h-full object-cover" />
                        ) : (
                            user?.name?.charAt(0).toUpperCase()
                        )}
                    </div>
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="absolute bottom-0 right-0 w-10 h-10 bg-red-500 text-white rounded-full shadow-md flex items-center justify-center hover:bg-red-600 transition-all active:scale-95 border-2 border-white"
                    >
                        {uploading ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-b-white"></div> : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} className="hidden" accept="image/*" />
                </div>

                <div className="flex-1 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                        <h1 className="text-3xl font-bold text-black">{user?.name}</h1>
                        <span className="px-3 py-1 bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-widest rounded-full">Pro Focuser</span>
                    </div>
                    <p className="text-gray-500 text-sm mb-6">{user?.email} · Joined {new Date(user?.createdAt).getFullYear()}</p>
                    
                    <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3">
                        <button className="w-full sm:w-auto px-6 py-2 bg-red-500 text-white text-sm font-semibold rounded-lg hover:bg-red-600 transition-all shadow-sm">Edit Profile</button>
                        <button onClick={logout} className="w-full sm:w-auto px-6 py-2 bg-white text-gray-500 text-sm font-semibold rounded-lg hover:text-red-500 hover:bg-red-50 border border-gray-200 transition-all">Disconnect</button>
                    </div>
                </div>

                {activeSession && (
                    <div className="hidden lg:flex flex-col items-center justify-center bg-red-50 bg-opacity-50 border border-red-100 p-6 rounded-2xl shrink-0 mt-6 lg:mt-0">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                            <p className="text-xs font-semibold text-red-600 uppercase tracking-widest">Live Session</p>
                        </div>
                        <p className="text-3xl font-bold text-black tabular-nums">{Math.floor(sessionTime / 60)}:{(sessionTime % 60).toString().padStart(2, '0')}</p>
                    </div>
                )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Focus Time', value: formatTime(stats.totalFocusTime), icon: '⏱️' },
                    { label: 'Sessions Completed', value: stats.sessionsCompleted, icon: '✅' },
                    { label: 'Avg Session Length', value: `${stats.averageSessionLength}m`, icon: '📊' },
                    { label: 'Global Rank', value: stats.rank > 0 ? `#${stats.rank}` : '—', icon: '🏆' },
                ].map((stat, i) => (
                    <div key={i} className="card-notion flex flex-col items-center justify-center text-center p-6 hover:-translate-y-1 transition-transform">
                        <span className="text-2xl mb-3">{stat.icon}</span>
                        <p className="text-2xl font-bold text-black mb-1 tabular-nums">{stat.value}</p>
                        <p className="text-xs font-semibold text-gray-400">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Achievement Section */}
            <div className="card-notion !bg-red-50 border border-red-100 shadow-sm text-black relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/20 rounded-full -mr-20 -mt-20 blur-3xl transition-transform group-hover:scale-110 duration-700"></div>
                
                <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-10">
                    <div>
                        <h2 className="text-xs font-semibold uppercase text-red-600 mb-2 tracking-widest">Current Tier</h2>
                        <h3 className="text-3xl font-bold text-black mb-2">{tier}</h3>
                        <p className="text-gray-500 text-sm">You have completed {stats.sessionsCompleted} focus sessions so far.</p>
                    </div>
                    <div className="text-left md:text-right shrink-0 w-full md:w-64">
                        <div className="flex items-center justify-between mb-2">
                             <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Next Tier: {nextTierGoal} Sessions</p>
                             <span className="text-sm font-bold text-red-600">{Math.round(progressPercent)}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-red-500 rounded-full transition-all duration-1000" style={{ width: `${progressPercent}%` }}></div>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    );
};

export default ProfilePage;

import { useState, useEffect } from 'react';
import { leaderboardService } from '../services/leaderboardService';
import { sessionService } from '../services/sessionService';
import { useAuth } from '../context/AuthContext';

const LeaderboardPage = () => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const [activeSession, setActiveSession] = useState(null);
    const [sessionTime, setSessionTime] = useState(0);

    useEffect(() => {
        loadLeaderboard();
        loadActiveSession();
    }, []);

    useEffect(() => {
        let interval = null;
        if (activeSession?.status === 'ACTIVE') {
            interval = setInterval(() => setSessionTime(prev => prev + 1), 1000);
        }
        return () => clearInterval(interval);
    }, [activeSession]);

    const loadLeaderboard = async () => {
        try {
            const data = await leaderboardService.getLeaderboard();
            setLeaderboard(data);
        } catch (error) {
            console.error('Leaderboard error');
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

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            </div>
        );
    }

    const topThree = leaderboard.slice(0, 3);
    const others = leaderboard.slice(3);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-gray-100">
                <div>
                    <h1 className="text-3xl font-bold text-black tracking-tight mb-2">Leaderboard</h1>
                    <p className="text-gray-500 text-sm">Top focusers in the community.</p>
                </div>
                {activeSession && (
                    <div className="card-notion py-3 px-5 flex items-center gap-4 w-full md:w-auto shrink-0 border-l-4 border-l-red-500">
                        <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-500 shrink-0">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <div className="flex-1">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-0.5">Live Session</p>
                            <p className="text-lg font-bold text-black tabular-nums leading-none">
                                {Math.floor(sessionTime / 60)}:{(sessionTime % 60).toString().padStart(2, '0')}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Podium Section */}
            {topThree.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-4">
                   {/* Rank 2 */}
                     {topThree[1] && (
                          <div className="card-notion flex flex-col items-center text-center p-8 order-2 md:order-1 hover:-translate-y-1 transition-transform">
                               <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-2xl mb-4 relative shadow-sm">
                                  🥈
                                  <div className="absolute -bottom-2 -right-2 bg-gray-200 text-black text-[10px] font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-white">2</div>
                               </div>
                               <h3 className="text-lg font-bold text-black truncate w-full">{topThree[1].name}</h3>
                               <p className="text-xs font-semibold text-gray-500 mt-2">
                                  {Math.floor(topThree[1].totalFocusTime / 60)}h {topThree[1].totalFocusTime % 60}m
                               </p>
                          </div>
                     )}
                   {/* Rank 1 */}
                    {topThree[0] && (
                         <div className="card-notion border-red-200 flex flex-col items-center text-center p-10 order-1 md:order-2 scale-105 z-10 relative overflow-hidden group hover:-translate-y-1 transition-transform border-t-4 border-t-red-500 shadow-lg">
                              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-4xl mb-6 relative shadow-sm">
                                 👑
                                 <div className="absolute -bottom-2 -right-2 bg-red-500 text-white text-xs font-bold w-8 h-8 rounded-full flex items-center justify-center border-2 border-white">1</div>
                              </div>
                              <h3 className="text-xl font-bold text-black truncate w-full">{topThree[0].name}</h3>
                              <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest mt-1">Top Focuser</p>
                              <div className="mt-4 flex flex-col items-center">
                                 <p className="text-2xl font-bold text-black">
                                    {Math.floor(topThree[0].totalFocusTime / 60)}h {topThree[0].totalFocusTime % 60}m
                                 </p>
                              </div>
                         </div>
                    )}
                   {/* Rank 3 */}
                    {topThree[2] && (
                         <div className="card-notion flex flex-col items-center text-center p-8 order-3 hover:-translate-y-1 transition-transform">
                              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-2xl mb-4 relative shadow-sm border border-gray-100">
                                 🥉
                                 <div className="absolute -bottom-2 -right-2 bg-gray-500 text-white text-[10px] font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-white">3</div>
                              </div>
                              <h3 className="text-lg font-bold text-black truncate w-full">{topThree[2].name}</h3>
                              <p className="text-xs font-semibold text-gray-500 mt-2">
                                 {Math.floor(topThree[2].totalFocusTime / 60)}h {topThree[2].totalFocusTime % 60}m
                              </p>
                         </div>
                    )}
                </div>
            )}
            
            {/* List View */}
            <div className="card-notion !p-0 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
                    <h3 className="text-sm font-semibold text-black">All Focusers</h3>
                </div>
                <div className="divide-y divide-gray-100 bg-white">
                    {others.length > 0 ? (
                        others.map((entry, index) => {
                            const isCurrentUser = entry.userId === user?.userId;
                            const rank = index + 4;
                            return (
                                <div key={entry.userId} className={`flex items-center px-6 py-4 transition-colors ${isCurrentUser ? 'bg-red-50/30' : 'hover:bg-gray-50'}`}>
                                    <div className="w-10 text-xs font-bold text-gray-400">{rank}</div>
                                    <div className="flex-1 flex items-center gap-4">
                                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-bold text-sm">
                                            {entry.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className={`text-sm font-semibold ${isCurrentUser ? 'text-red-600' : 'text-black'}`}>
                                                {entry.name} {isCurrentUser && <span className="ml-2 text-[10px] font-bold px-2 py-0.5 bg-red-100 text-red-600 rounded">You</span>}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-black tabular-nums">
                                            {Math.floor(entry.totalFocusTime / 60)}h {entry.totalFocusTime % 60}m
                                        </p>
                                        <p className="text-xs text-gray-500 mt-0.5">Focused</p>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        topThree.length === 0 && (
                            <div className="py-16 text-center">
                                <p className="text-4xl mb-4 opacity-50">🏆</p>
                                <p className="text-sm font-medium text-gray-500">No focus data yet. Be the first!</p>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default LeaderboardPage;

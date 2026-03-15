import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { sessionService } from '../services/sessionService';
import { taskService } from '../services/taskService';
import { leaderboardService } from '../services/leaderboardService';
import { userService } from '../services/userService';

const DashboardPage = () => {
  const { user } = useAuth();
  const [activeSession, setActiveSession] = useState(null);
  const [sessionTime, setSessionTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [joinRoomId, setJoinRoomId] = useState('');
  const [stats, setStats] = useState({
    totalFocusTime: 0,
    sessionsCompleted: 0,
    tasksPending: 0,
    tasksCompleted: 0
  });

  useEffect(() => {
    loadActiveSession();
    loadTasks();
    loadStats();
  }, []);

  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => setSessionTime(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const loadActiveSession = async () => {
    try {
      const session = await sessionService.getActiveSession(user.userId);
      if (session) {
        setActiveSession(session);
        setIsRunning(session.status === 'ACTIVE');
        if (session.status === 'ACTIVE') {
          const elapsed = Math.floor((Date.now() - new Date(session.startTime).getTime()) / 1000);
          setSessionTime(elapsed);
        }
      }
    } catch (error) {
      console.error('Error loading active session:', error);
    }
  };

  const loadTasks = async () => {
    try {
      const data = await taskService.getUserTasks(user.userId);
      setTasks(data);
      setStats(prev => ({
        ...prev,
        tasksPending: data.filter(t => t.status === 'PENDING' || t.status === 'IN_PROGRESS').length,
        tasksCompleted: data.filter(t => t.status === 'COMPLETED').length
      }));
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const loadStats = async () => {
    try {
      const history = await sessionService.getSessionHistory(user.userId);
      const totalTime = history.reduce((sum, s) => sum + (s.focusDuration || 0), 0);
      
      // Fetch rank and user profile for streak
      const [rankData, profileData] = await Promise.all([
          leaderboardService.getUserRank(user.userId),
          userService.getCurrentUser(user.userId)
      ]);
      
        setStats(prev => ({ 
        ...prev, 
        totalFocusTime: totalTime, 
        sessionsCompleted: history.length,
        rank: rankData.rank
      }));
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    try {
      const newTask = await taskService.createTask(newTaskTitle, user.userId);
      setTasks(prev => [newTask, ...prev]);
      setNewTaskTitle('');
      setStats(prev => ({ ...prev, tasksPending: prev.tasksPending + 1 }));
    } catch (error) {
      alert('Failed to create task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await taskService.deleteTask(taskId);
      setTasks(prev => prev.filter(t => t.taskId !== taskId));
    } catch (error) {
      alert('Failed to delete task');
    }
  };

  const handleUpdateTask = async (taskId, newStatus) => {
    try {
      await taskService.updateTaskStatus(taskId, newStatus);
      loadTasks();
    } catch (error) {
      console.error('Update failed');
    }
  };

  const handleJoinById = async (e) => {
    e.preventDefault();
    if (!joinRoomId.trim()) return;
    try {
      await sessionService.joinRoom(joinRoomId); // Assuming sessionService or roomService has joinRoom
      window.location.href = `/room/${joinRoomId}`;
    } catch (error) {
      // Fallback to direct navigation if join fails but room might exist
      window.location.href = `/room/${joinRoomId}`;
    }
  };

  const formatFocusTime = (minutes) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  const formatSessionTime = (secs) => `${Math.floor(secs / 60)}:${(secs % 60).toString().padStart(2, '0')}`;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-gray-100">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-black tracking-tight mb-2">
            Welcome back, <span className="text-red-500">{user?.name?.split(' ')[0]}</span>
          </h1>
          <p className="text-gray-500 text-sm">You've focused for {formatFocusTime(stats.totalFocusTime)} today. Ready for another session?</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <Link to="/rooms" className="w-full md:w-auto px-6 py-2.5 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 shadow-sm transition-all text-sm flex items-center justify-center gap-2">
            Join Workspace
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Today's Focus Time", value: formatFocusTime(stats.totalFocusTime), icon: "⏱️" },
          { label: "Active Sessions", value: `${stats.sessionsCompleted} completed`, icon: "🔥" },
          { label: "Completed Tasks", value: `${stats.tasksCompleted} tasks`, icon: "✅" },
          { label: "Leaderboard Rank", value: `#${stats.rank || '--'}`, icon: "🏆" },
        ].map((stat, i) => (
          <div key={i} className="card-notion flex flex-col justify-between group hover:-translate-y-1 transition-transform cursor-default">
            <div className="flex items-center justify-between mb-4">
               <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest">{stat.label}</p>
               <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                  {stat.icon}
               </div>
            </div>
            <p className="text-3xl font-bold text-black">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Active Session & Quick Actions */}
        <div className="lg:col-span-4 space-y-6">
          <div className="card-notion relative overflow-hidden group">
             {isRunning && (
               <div className="absolute top-0 left-0 w-full h-1 bg-gray-100">
                  <div className="h-full bg-red-500 animate-pulse transition-all duration-1000" style={{width: '60%'}}></div>
               </div>
             )}
             <div className="flex items-center justify-between mb-4 mt-2">
               <h3 className="text-sm font-semibold text-black uppercase tracking-wider">Active Workspace</h3>
               {isRunning && <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>}
             </div>
             
             {activeSession ? (
               <div className="flex flex-col items-center justify-center py-4">
                 <div className="text-5xl font-bold text-black mb-6 tracking-tight tabular-nums">{formatSessionTime(sessionTime)}</div>
                 <Link to={`/room/${activeSession.roomId}`} className="w-full py-3 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-all text-center">
                    Resume Session
                 </Link>
               </div>
             ) : (
               <div className="py-4 text-center">
                 <p className="text-gray-500 text-sm mb-6">No active focus session.</p>
                 <Link to="/rooms" className="inline-block w-full py-3 px-6 border border-gray-200 rounded-lg text-sm font-medium text-black hover:border-red-500 hover:text-red-600 transition-all">
                    Start Timer
                 </Link>
               </div>
             )}
          </div>

          <div className="card-notion">
            <h3 className="text-sm font-semibold text-black uppercase tracking-wider mb-4">Quick Join</h3>
            <form onSubmit={handleJoinById} className="space-y-3">
               <input 
                  type="text" 
                  value={joinRoomId}
                  onChange={(e) => setJoinRoomId(e.target.value)}
                  placeholder="Paste Room ID..." 
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-black placeholder:text-gray-400"
               />
               <button type="submit" className="w-full py-2 bg-black text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-gray-800 transition-all">
                  Join Room
               </button>
            </form>
          </div>

          <div className="card-notion">
            <h3 className="text-sm font-semibold text-black uppercase tracking-wider mb-4">Quick Links</h3>
            <div className="space-y-2">
                {[
                    { label: 'Leaderboard Rankings', to: '/leaderboard' },
                    { label: 'Profile Settings', to: '/profile' }
                ].map((link, i) => (
                    <Link key={i} to={link.to} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all group">
                        <span className="text-sm font-medium text-gray-700">{link.label}</span>
                        <svg className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                    </Link>
                ))}
            </div>
          </div>
        </div>

        {/* Tasks Section */}
        <div className="lg:col-span-8">
            <div className="card-notion h-full flex flex-col">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
                    <div>
                        <h3 className="text-lg font-bold text-black">Study Tasks</h3>
                        <p className="text-sm text-gray-500 mt-1">Manage your active assignments and goals.</p>
                    </div>
                </div>

                <form onSubmit={handleCreateTask} className="flex flex-col sm:flex-row items-center gap-3 mb-6">
                    <input 
                        type="text" 
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        placeholder="Add a new task (e.g., Read chapter 4)..." 
                        className="w-full sm:flex-1 bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-black placeholder:text-gray-400"
                    />
                    <button type="submit" className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap">
                        Add Task
                    </button>
                </form>

                <div className="space-y-3 flex-1 overflow-y-auto">
                    {tasks.map((task) => (
                        <div key={task.taskId} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg group hover:border-gray-300 transition-all">
                            <div className="flex items-center gap-3 min-w-0">
                                <span className={`text-sm ${task.status === 'COMPLETED' ? 'text-gray-400 line-through' : 'text-black font-medium'}`}>
                                    {task.taskName}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={() => handleUpdateTask(task.taskId, task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED')}
                                    className={`px-3 py-1 text-xs rounded transition-all ${
                                        task.status === 'COMPLETED' 
                                            ? 'bg-gray-100 text-gray-500 hover:bg-gray-200' 
                                            : 'bg-green-500 text-white hover:bg-green-600'
                                    }`}
                                >
                                    {task.status === 'COMPLETED' ? 'Undo' : 'Complete'}
                                </button>
                                <button 
                                    onClick={() => handleDeleteTask(task.taskId)}
                                    className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-all"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                    {tasks.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <p className="text-gray-500 text-sm font-medium">No tasks right now.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

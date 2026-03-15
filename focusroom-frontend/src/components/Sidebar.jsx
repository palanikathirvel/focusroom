import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user } = useAuth();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { name: 'Study Rooms', path: '/rooms', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5S19.832 5.477 21 6.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
    { name: 'Leaderboard', path: '/leaderboard', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { name: 'Profile', path: '/profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  ];

  return (
    <div className={`bg-white border-r border-gray-200 text-black w-64 h-screen fixed left-0 top-0 flex flex-col z-40 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
      <div className="px-6 py-4 md:py-6">
        <div className="flex items-center justify-between gap-3 mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-red-500 p-2 rounded-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5S19.832 5.477 21 6.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h1 className="text-lg font-bold tracking-tight text-black">FocusRoom</h1>
          </div>
          <button 
            className="md:hidden p-2 text-gray-500 hover:text-black rounded-lg"
            onClick={() => setIsOpen(false)}
          >
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group ${
                  isActive 
                    ? 'bg-red-600 text-white font-medium' 
                    : 'text-gray-400 hover:bg-red-500 hover:text-white'
                }`
              }
            >
              <svg className="w-5 h-5 transition-opacity shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
              </svg>
              <span className="text-sm tracking-wide truncate">{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="mt-auto px-6 py-6 border-t border-gray-200">
        <div className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg cursor-pointer transition-all duration-300">
          <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200 overflow-hidden">
            {user?.profileImageUrl ? (
              <img src={import.meta.env.VITE_API_URL?.replace('/api', '') + user.profileImageUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="font-semibold text-sm text-gray-700">{user?.name?.charAt(0).toUpperCase() || 'U'}</span>
            )}
          </div>
          <div className="min-w-0">
            <p className="font-medium text-sm text-black truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 truncate">Scholar</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

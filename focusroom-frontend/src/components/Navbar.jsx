import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const quotes = [
    { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
    { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
    { text: "The future depends on what you do today.", author: "Mahatma Gandhi" },
    { text: "Learning never exhausts the mind.", author: "Leonardo da Vinci" },
    { text: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
    { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { text: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
    { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
    { text: "Push yourself, because no one else is going to do it for you.", author: "Unknown" },
    { text: "Great things never come from comfort zones.", author: "Unknown" },
    { text: "Dream it. Wish it. Do it.", author: "Unknown" },
    { text: "Study hard what interests you the most in the most undisciplined, irreverent and original manner possible.", author: "Richard Feynman" },
    { text: "The more that you read, the more things you will know.", author: "Dr. Seuss" },
    { text: "Let your joy be in your journey, not in the destination.", author: "Albert Einstein" }
];

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showQuote, setShowQuote] = useState(false);
  const [quote, setQuote] = useState(quotes[0]);

  const handleNotificationClick = () => {
      if (!showQuote) {
          const idx = Math.floor(Math.random() * quotes.length);
          setQuote(quotes[idx]);
      }
      setShowQuote(!showQuote);
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Dashboard';
    if (path.startsWith('/rooms')) return 'Study Rooms';
    if (path.startsWith('/room/')) return 'Workspace';
    if (path === '/leaderboard') return 'Leaderboard';
    if (path === '/profile') return 'My Profile';
    return 'FocusRoom';
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-4 md:px-6 py-4 flex justify-between items-center sticky top-0 z-20">
      <div className="flex items-center gap-3 md:gap-4">
        <button 
          className="md:hidden p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg transition-colors focus:outline-none"
          onClick={toggleSidebar}
        >
          <svg className="w-6 h-6" fill="fill" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h2 className="text-lg md:text-xl font-semibold text-black leading-none truncate">{getPageTitle()}</h2>
      </div>

      <div className="flex items-center gap-6">
        {/* Search Bar */}
        <div className="hidden md:flex items-center bg-white border border-gray-300 rounded-xl px-4 py-2 w-72 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-100 transition-all duration-300">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" placeholder="Search..." className="bg-transparent border-none text-sm text-black placeholder:text-gray-400 focus:outline-none w-full ml-2" />
        </div>

        <div className="flex items-center gap-5">
          {/* Notifications */}
          <div className="relative">
            <button onClick={handleNotificationClick} className="text-gray-500 hover:text-red-500 transition-colors relative block focus:outline-none">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            {showQuote && (
                <div className="absolute right-0 mt-3 w-72 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-4 bg-red-50 border-b border-red-100 flex items-center gap-2">
                        <span className="text-xl">💡</span>
                        <h3 className="text-sm font-bold text-red-700 uppercase tracking-widest">Daily Motivation</h3>
                    </div>
                    <div className="p-5">
                       <p className="text-sm font-medium text-black leading-relaxed italic mb-3">"{quote.text}"</p>
                       <p className="text-xs font-semibold text-gray-500 text-right">— {quote.author}</p>
                    </div>
                </div>
            )}
          </div>
          
          <div className="h-6 w-px bg-gray-200"></div>

          {/* User Profile */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/profile')}>
            <div className="w-9 h-9 rounded-full bg-gray-100 overflow-hidden border border-gray-200 group-hover:border-red-500 transition-colors">
              {user?.profileImageUrl ? (
                <img src={import.meta.env.VITE_API_URL?.replace('/api', '') + user.profileImageUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-700 font-semibold text-sm">
                    {user?.name?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                logout();
              }}
              className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-300"
              title="Logout"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

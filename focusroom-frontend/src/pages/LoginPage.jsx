import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Authentication failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col md:flex-row font-sans selection:bg-red-100 selection:text-red-600">
            {/* Left Visual Panel */}
            <div className="hidden md:flex flex-col justify-between w-[40%] bg-gray-50 border-r border-gray-200 p-12 relative overflow-hidden">
                <Link to="/" className="flex items-center gap-3 relative z-10">
                    <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center shadow-sm">
                        <span className="text-white font-bold text-lg">F</span>
                    </div>
                    <span className="text-lg font-bold text-black tracking-tight">FocusRoom</span>
                </Link>

                <div className="relative z-10">
                    <h2 className="text-4xl font-bold text-black leading-tight mb-6">
                        Welcome back to<br />
                        <span className="text-red-500">deep work.</span>
                    </h2>
                    <p className="text-gray-500 text-base leading-relaxed max-w-sm">
                        Your workspace, tasks, and study groups are ready for another productive session.
                    </p>
                </div>

                <div className="flex gap-8 relative z-10">
                    <div>
                        <p className="text-black font-bold text-2xl">2M+</p>
                        <p className="text-xs font-semibold text-gray-400 mt-1">Mins Focused</p>
                    </div>
                    <div>
                        <p className="text-black font-bold text-2xl">50k+</p>
                        <p className="text-xs font-semibold text-gray-400 mt-1">Sessions Done</p>
                    </div>
                </div>
            </div>

            {/* Right Auth Panel */}
            <div className="flex-1 flex items-center justify-center p-8 md:p-20 bg-white">
                <div className="w-full max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Mobile Header */}
                    <Link to="/" className="flex items-center gap-3 mb-10 md:hidden">
                        <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">F</span>
                        </div>
                        <span className="text-lg font-bold text-black">FocusRoom</span>
                    </Link>

                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-black mb-2">Sign In</h1>
                        <p className="text-gray-500 text-sm">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-red-500 font-semibold hover:text-red-600">
                                Join now
                            </Link>
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm font-medium mb-6">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-700">Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all placeholder:text-gray-400"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-semibold text-gray-700">Password</label>
                                <a href="#" className="text-xs font-medium text-red-500 hover:text-red-600">Forgot?</a>
                            </div>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all placeholder:text-gray-400"
                            />
                        </div>
                        
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2.5 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-all shadow-sm mt-6"
                        >
                            {loading ? 'Authenticating...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="mt-10 pt-6 border-t border-gray-100 text-center">
                        <p className="text-xs text-gray-400">
                            Built for deep focus.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;

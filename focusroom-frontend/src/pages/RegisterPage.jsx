import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await register(name, email, password);
            navigate('/dashboard');
        } catch (err) {
            let errorMessage = 'Registration failed. Please try again.';
            if (err.response?.status === 404) {
                errorMessage = 'Server connection failed.';
            } else if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err.message) {
                errorMessage = err.message;
            }
            setError(errorMessage);
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
                        Join the global<br />
                        <span className="text-red-500">study library.</span>
                    </h2>
                    <p className="text-gray-500 text-base leading-relaxed max-w-sm">
                        Build better habits, study with peers, and reach your academic goals faster.
                    </p>
                </div>

                <div className="space-y-4 relative z-10">
                    {['Always Free', 'Real-time Sync', 'Global Rankings'].map(feat => (
                        <div key={feat} className="flex items-center gap-3">
                            <div className="w-5 h-5 bg-red-100 text-red-500 rounded-full flex items-center justify-center">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>
                            </div>
                            <span className="text-sm font-semibold text-gray-600">{feat}</span>
                        </div>
                    ))}
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
                        <h1 className="text-3xl font-bold text-black mb-2">Create Account</h1>
                        <p className="text-gray-500 text-sm">
                            Already have an account?{' '}
                            <Link to="/login" className="text-red-500 font-semibold hover:text-red-600">
                                Sign in
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
                            <label className="text-sm font-semibold text-gray-700">Full Name</label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Alex Johnson"
                                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all placeholder:text-gray-400"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-700">Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="alex@university.edu"
                                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all placeholder:text-gray-400"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-700">Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all placeholder:text-gray-400"
                            />
                            <p className="text-xs text-gray-500 mt-1">Minimum 8 characters with at least one number.</p>
                        </div>
                        
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2.5 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-all shadow-sm mt-6"
                        >
                            {loading ? 'Creating account...' : 'Create Account'}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-xs text-gray-500 max-w-xs mx-auto">
                        By signing up, you agree to our <a href="#" className="underline hover:text-gray-700">Terms</a> and <a href="#" className="underline hover:text-gray-700">Privacy Policy</a>.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;

import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-white font-sans text-black selection:bg-red-100 selection:text-red-600">
            {/* Nav */}
            <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center shadow-lg shadow-gray-200/50">
                            <span className="text-red-600 font-black text-xl">F</span>
                        </div>
                        <span className="text-xl font-black tracking-tight">FocusRoom</span>
                    </div>
                    <div className="hidden md:flex items-center gap-8">
                        <a href="#features" className="text-sm font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors">Features</a>
                        <a href="#about" className="text-sm font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors">Community</a>
                        <Link to="/login" className="text-sm font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors">Sign In</Link>
                        <Link to="/register" className="px-6 py-3 bg-red-600 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-red-700 transition-all active:scale-95 shadow-xl shadow-red-600/20">
                            Join Free
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-40 pb-32 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/5 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/5 rounded-full blur-3xl"></div>
                </div>

                <div className="max-w-7xl mx-auto px-6 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-100 rounded-full mb-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                        <span className="flex h-2 w-2 rounded-full bg-red-600 animate-pulse"></span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Trusted by 10,000+ Students globally</span>
                    </div>
                    
                    <h1 className="text-6xl md:text-8xl font-black leading-[0.95] tracking-tighter mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 transition-all">
                        Deep focus.<br />
                        <span className="text-red-600">Zero distractions.</span>
                    </h1>
                    
                    <p className="max-w-2xl mx-auto text-xl text-gray-400 font-medium leading-relaxed mb-12 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                        The ultimate collaborative workspace for serious students. Join live libraries, track your progress, and master your productivity.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-12 duration-1000">
                        <Link to="/register" className="w-full sm:w-auto px-10 py-5 bg-red-600 text-white text-sm font-black uppercase tracking-widest rounded-[2rem] hover:bg-red-700 transition-all active:scale-95 shadow-2xl shadow-red-600/20">
                            Start Your First Session →
                        </Link>
                        <Link to="/login" className="w-full sm:w-auto px-10 py-5 bg-white text-black text-sm font-black uppercase tracking-widest rounded-[2rem] border border-gray-100 hover:bg-gray-50 transition-all active:scale-95">
                            Sign In
                        </Link>
                    </div>
                </div>
            </section>

            {/* Feature Showcase Grid */}
            <section id="features" className="py-32 bg-gray-50/50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="mb-20 text-center">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-red-600 mb-4">The Methodology</h2>
                        <h3 className="text-4xl font-black tracking-tight">Everything you need to master focus.</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { 
                                icon: '🎯', 
                                title: 'Circular Pomodoro', 
                                desc: 'High-fidelity visual timer designed to reduce cognitive load and keep you locked in.' 
                            },
                            { 
                                icon: '🤝', 
                                title: 'Live Libraries', 
                                desc: 'Study alongside hundreds of peers in real-time. Accountability is built into every room.' 
                            },
                            { 
                                icon: '📈', 
                                title: 'XP & Progression', 
                                desc: 'Gamified focus tracking. Level up your profile as you complete deeper study sessions.' 
                            }
                        ].map(({ icon, title, desc }) => (
                            <div key={title} className="card-notion group !p-10 border-none ring-1 ring-gray-100 hover:ring-red-100 transition-all hover:translate-y-[-8px]">
                                <div className="w-16 h-16 bg-white border border-gray-100 rounded-[1.5rem] flex items-center justify-center text-3xl mb-8 group-hover:scale-110 group-hover:bg-red-600 group-hover:text-white transition-all shadow-sm">
                                    {icon}
                                </div>
                                <h4 className="text-xl font-black mb-4">{title}</h4>
                                <p className="text-gray-400 font-medium leading-relaxed">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Visual Teaser */}
            <section className="py-32">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="card-notion !bg-red-50 border border-red-100 shadow-sm !p-12 md:!p-20 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full -mr-48 -mt-48 blur-3xl group-hover:scale-125 transition-transform duration-1000"></div>
                        
                        <div className="relative z-10 grid md:grid-cols-2 items-center gap-16">
                            <div>
                                <h2 className="text-4xl md:text-5xl font-black text-black leading-tight mb-8">
                                    A professional setup<br />
                                    <span className="text-red-600">for elite learners.</span>
                                </h2>
                                <p className="text-gray-500 text-lg font-medium mb-10 leading-relaxed">
                                    Inspired by the minimal design systems of Notion and the collaborative energy of Discord. 
                                    FocusRoom is built to be your digital study sanctuary.
                                </p>
                                <div className="space-y-4">
                                    {['Real-time Member Status', 'Shared Resource Library', 'Global Competitive Leaderboards'].map(item => (
                                        <div key={item} className="flex items-center gap-3">
                                            <div className="w-5 h-5 bg-red-600/20 text-red-600 rounded-full flex items-center justify-center">
                                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>
                                            </div>
                                            <span className="text-xs font-black uppercase tracking-widest text-gray-300">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="relative">
                                {/* Visual Mockup Placeholder */}
                                <div className="aspect-square bg-gray-50 rounded-[3rem] border border-gray-200 p-8 shadow-2xl relative">
                                    <div className="w-full h-full border-2 border-dashed border-gray-200 rounded-[2rem] flex flex-col items-center justify-center text-center">
                                        <div className="w-32 h-32 border-4 border-red-600 rounded-full mb-6 animate-pulse"></div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Work in Progress Preview</p>
                                    </div>
                                    {/* Floating stats */}
                                    <div className="absolute top-10 -left-10 card-notion !p-4 !bg-red-50 scale-75 shadow-2xl">
                                        <p className="text-[9px] font-black text-red-600 uppercase">Focus Time</p>
                                        <p className="text-xl font-black text-black">⏱️ 120 Mins</p>
                                    </div>
                                    <div className="absolute bottom-10 -right-10 card-notion !p-4 !bg-red-50 scale-75 shadow-2xl">
                                        <p className="text-[9px] font-black text-gray-400 uppercase">XP Earned</p>
                                        <p className="text-xl font-black text-black">+1,240</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Community Proof */}
            <section className="py-20 border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-wrap justify-between items-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
                        <div className="text-2xl font-black tracking-tighter">MIT</div>
                        <div className="text-2xl font-black tracking-tighter">STANFORD</div>
                        <div className="text-2xl font-black tracking-tighter">OXFORD</div>
                        <div className="text-2xl font-black tracking-tighter">IIT</div>
                        <div className="text-2xl font-black tracking-tighter">NUS</div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 bg-white border-t border-gray-200 text-black">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-4 gap-12 mb-20">
                        <div className="col-span-2">
                             <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-sm">
                                    <span className="text-white font-black text-xl">F</span>
                                </div>
                                <span className="text-xl font-black tracking-tight text-black">FocusRoom</span>
                            </div>
                            <p className="text-gray-500 max-w-sm font-medium leading-relaxed">
                                Designing the future of digital study environments. Built for flow, crafted for results.
                            </p>
                        </div>
                        <div>
                            <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6">Product</h5>
                            <ul className="space-y-4 text-sm font-bold text-gray-500">
                                <li><a href="#" className="hover:text-red-500 transition-colors">Workspace</a></li>
                                <li><a href="#" className="hover:text-red-500 transition-colors">Leaderboards</a></li>
                                <li><a href="#" className="hover:text-red-500 transition-colors">Study Rooms</a></li>
                            </ul>
                        </div>
                        <div>
                            <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6">Company</h5>
                            <ul className="space-y-4 text-sm font-bold text-gray-500">
                                <li><a href="#" className="hover:text-red-500 transition-colors">About Us</a></li>
                                <li><a href="#" className="hover:text-red-500 transition-colors">Privacy</a></li>
                                <li><a href="#" className="hover:text-red-500 transition-colors">Terms</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-10 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
                        <p className="text-xs font-bold text-gray-500">© 2025 FocusRoom Engineering. All rights reserved.</p>
                        <div className="flex gap-6">
                            <a href="#" className="text-gray-500 hover:text-black transition-colors">Twitter</a>
                            <a href="#" className="text-gray-500 hover:text-black transition-colors">Discord</a>
                            <a href="#" className="text-gray-500 hover:text-black transition-colors">GitHub</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;

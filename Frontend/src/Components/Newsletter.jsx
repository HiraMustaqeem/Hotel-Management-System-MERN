import React, { useState } from 'react';

function Newsletter() {
    const [email, setEmail] = useState('');
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [error, setError] = useState('');

    const handleSubscribe = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!email) {
            setError("Please enter an email");
        } else if (!emailRegex.test(email)) {
            setError("Invalid email address");
        } else {
            setError("");
            setIsSubscribed(true);
        }
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
                * { font-family: 'Poppins', sans-serif; }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(5px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
            `}</style>
            
            {/* py-20 ko kam karke py-10 kiya taake strip patli ho jaye */}
            <div className="w-full bg-slate-900 px-6 py-10 md:py-12 text-center text-white flex flex-col items-center justify-center border-y border-slate-800">
                
                {/* Text section ko mazeed compact kiya */}
                <div className="max-w-3xl w-full">
                    <p className="text-indigo-500 font-semibold tracking-[0.2em] uppercase text-[10px] mb-2">Newsletter</p>
                    
                    <h2 className="font-bold text-2xl md:text-3xl leading-tight">
                        Subscribe for <span className="text-indigo-400">Latest Discounts</span>
                    </h2>

                    <div className="mt-6 w-full max-w-lg mx-auto">
                        {!isSubscribed ? (
                            <div className="w-full">
                                {/* Input Container: Height kam ki gayi hai (h-12) */}
                                <div className={`flex flex-col sm:flex-row items-center p-1 border transition-all duration-300 ${error ? 'border-red-500' : 'border-slate-700'} focus-within:border-indigo-500 rounded-xl sm:rounded-full bg-slate-800/40 w-full`}>
                                    <input 
                                        type="email" 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="bg-transparent outline-none px-5 py-3 sm:py-0 h-11 flex-1 text-white text-sm w-full" 
                                        placeholder="Email address"
                                    />
                                    <button 
                                        onClick={handleSubscribe}
                                        className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition-all text-white rounded-lg sm:rounded-full h-11 px-8 flex items-center justify-center font-semibold text-xs whitespace-nowrap shadow-lg shadow-indigo-900/20"
                                    >
                                        Subscribe
                                    </button>
                                </div>
                                {error && (
                                    <p className="text-red-400 text-[10px] mt-2 font-bold uppercase tracking-widest animate-fadeIn text-left sm:text-center pl-4">
                                        {error}
                                    </p>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center gap-3 animate-fadeIn py-2">
                                <div className="w-8 h-8 bg-indigo-600/20 text-indigo-400 rounded-full flex items-center justify-center border border-indigo-500/30">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                </div>
                                <h3 className="text-lg font-bold text-indigo-400">You're on the list!</h3>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Newsletter;
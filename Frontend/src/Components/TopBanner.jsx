import React from 'react';

const TopBanner = () => {
    return (
        <>
            <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap');
                    * { font-family: "Geist", sans-serif; }

                    @keyframes marquee {
                        0% { transform: translateX(0); }
                        100% { transform: translateX(-50%); }
                    }

                    .animate-marquee {
                        display: flex;
                        width: max-content;
                        animation: marquee 30s linear infinite;
                    }

                    .animate-marquee:hover {
                        animation-play-state: paused;
                    }
                `}
            </style>

            {/* Banner Container: Ab BG Blue aur Text White hai */}
            <div className="w-full overflow-hidden bg-indigo-600 py-3 border-b border-white/10 shadow-lg">
                <div className="animate-marquee whit
                espace-nowrap flex items-center">
                    
                    {/* Loop Content */}
                    {[1, 2].map((i) => (
                        <div key={i} className="flex items-center gap-12 md:gap-24 px-4">
                            
                            {/* Hotel Promo */}
                            <div className="flex items-center gap-4">
                                <span className="flex h-2 w-2 rounded-full bg-white animate-pulse"></span>
                                <p className='text-[13px] font-semibold text-white tracking-wide uppercase'>
                                    Exclusive Deal: Book 3 Nights, Get 1 Night Free
                                </p>
                                <div className="hidden sm:block border border-blue-400/50 px-3 py-0.5 rounded-md text-[10px] font-bold text-blue-100">
                                    SUMMER-2026
                                </div>
                            </div>

                            {/* Countdown Section */}
                            <div className="flex items-center gap-4">
                                <p className='text-[13px] font-medium text-blue-100 italic'>Offer ends in:</p>
                                <div className="flex items-center gap-3">
                                    <div className="flex flex-col items-center">
                                        <span className="text-sm font-bold text-white">05</span>
                                        <span className="text-[9px] text-blue-200 font-light -mt-1">DAYS</span>
                                    </div>
                                    <span className="text-blue-300 font-bold mb-2">:</span>
                                    <div className="flex flex-col items-center">
                                        <span className="text-sm font-bold text-white">24</span>
                                        <span className="text-[9px] text-blue-200 font-light -mt-1">HOURS</span>
                                    </div>
                                    <span className="text-blue-300 font-bold mb-2">:</span>
                                    <div className="flex flex-col items-center">
                                        <span className="text-sm font-bold text-white">48</span>
                                        <span className="text-[9px] text-blue-200 font-light -mt-1">MINS</span>
                                    </div>
                                </div>
                            </div>

                            {/* Call to Action */}
                            <div className="flex items-center gap-5">
                                <p className='text-[13px] font-bold text-white'>
                                     5-STAR LUXURY EXPERIENCE AWAITS YOU
                                </p>
                                <a href='#booking' className='text-[11px] font-black text-indigo-600 bg-white px-5 py-1.5 rounded-full hover:bg-blue-50 transition-all transform hover:scale-105 shadow-md'>
                                    BOOK NOW
                                </a>
                            </div>

                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default TopBanner;
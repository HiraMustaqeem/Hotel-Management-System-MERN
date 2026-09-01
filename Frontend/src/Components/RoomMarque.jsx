import React from "react";
import { Link } from "react-router-dom";
const RoomMarque = () => {
    const [stopScroll, setStopScroll] = React.useState(false);
    
    const cardData = [
        {
            title: "Master Suite - Luxury King Bed",
            image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&auto=format&fit=crop&q=60",
        },
        {
            title: "Executive Room - City Skyline View",
            image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&auto=format&fit=crop&q=60",
        },
        {
            title: "Family Wing - Triple Bed Comfort",
            image: "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800&auto=format&fit=crop&q=60",
        },
        {
            title: "Couple's Nest -  Balcony",
            image: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&auto=format&fit=crop&q=60",
        },
        {
            title: "Single Cozy - Sunrise Window",
            image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&auto=format&fit=crop&q=60",
        },
    ];

    return (
        <section className="py-20 bg-white overflow-hidden">
            <style>{`
                .marquee-inner {
                    animation: marqueeScroll linear infinite;
                }
                @keyframes marqueeScroll {
                    0% { transform: translateX(0%); }
                    100% { transform: translateX(-50%); }
                }
            `}</style>

            {/* Header Section */}
            <div className="max-w-4xl mx-auto text-center px-6 mb-12">
                <h2 className="text-4xl font-black text-gray-900 mb-4">Book Your Room Right Now</h2>
                <p className="text-gray-500 text-lg">
                   From single explorers and  <span className=" font-bold ">families </span> to <span className=" font-bold ">Couples </span> and   <span className="font-bold"> Single </span> we provide bespoke spaces for every stay. Elevate your experience with the breathtaking views and luxury you deserve.
                </p>
            </div>

            {/* Marquee Container */}
            <div 
                className="overflow-hidden w-full relative" 
                onMouseEnter={() => setStopScroll(true)} 
                onMouseLeave={() => setStopScroll(false)}
            >
                {/* Side Gradients for Smooth Fade */}
                <div className="absolute left-0 top-0 h-full w-24 z-20 pointer-events-none bg-linear-to-r from-white to-transparent" />
                <div className="absolute right-0 top-0 h-full w-24 z-20 pointer-events-none bg-linear-to-l from-white to-transparent" />

                <div 
                    className="marquee-inner flex w-fit" 
                    style={{ 
                        animationPlayState: stopScroll ? "paused" : "running", 
                        animationDuration: "30s" 
                    }}
                >
                    <div className="flex">
                        {[...cardData, ...cardData].map((card, index) => (
                            <div key={index} className="w-64 md:w-72 mx-3 h-88 relative group overflow-hidden rounded-3xl transition-all duration-500 cursor-pointer shadow-lg border border-gray-100">
                                <img 
                                    src={card.image} 
                                    alt={card.title} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                />
                                {/* Overlay with Text */}
                                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                    <p className="text-white text-xl font-bold leading-tight transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                        {card.title}
                                    </p>
                                    <button className="mt-4 text-xs font-bold text-indigo-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                        Check Availability &rarr;
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* View More Button */}
    {/* <div className="flex justify-center mt-12">

                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-4 rounded-full font-bold text-sm uppercase tracking-[2px] shadow-xl shadow-indigo-100 transition-all hover:-translate-y-1 active:scale-95">

                    View More Rooms

                </button>

            </div>  */}



<div className="flex justify-center mt-12">
    <Link 
        to="/rooms" 
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-4 rounded-full font-bold text-sm uppercase tracking-[2px] shadow-xl shadow-indigo-100 transition-all hover:-translate-y-1 active:scale-95 inline-block text-center"
    >
        View More Rooms
    </Link>
</div>
        </section>
    );
};

export default RoomMarque;
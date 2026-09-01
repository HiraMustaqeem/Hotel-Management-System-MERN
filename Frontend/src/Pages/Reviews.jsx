import React from 'react'


function Reviews() {
        const testimonials = [
        { 
            id: 1, 
            description: "Staff ka behavior boht acha tha. Room service on time mili aur cleanliness 10/10 thi. Executive suite view was stunning.", 
            image: "https://i.pravatar.cc/100?img=12", // Male
            name: "Zohaib Khan", 
            company: "Business Traveler" 
        },
        { 
            id: 2, 
            description: "Family ke sath stay boht comfortable raha. Triple bed room ka space kafi acha hai aur breakfast buffet ka taste lajawab tha.", 
            image: "https://i.pravatar.cc/100?img=5", // Female
            name: "Sarah Ahmed", 
            company: "Family Guest" 
        },
        { 
            id: 3, 
            description: "Stayed here for a conference. High-speed internet aur quiet environment ki wajah se work meetings asani se ho gayin.", 
            image: "https://i.pravatar.cc/100?img=8", // Male
            name: "M. Usman", 
            company: "Tech Consultant" 
        },
        { 
            id: 4, 
            description: "Everything was perfect! Especially the rooftop view at night. Checking-in was very smooth, no waiting time at all.", 
            image: "https://i.pravatar.cc/100?img=44", // Female
            name: "Areeba Shah", 
            company: "Leisure Guest" 
        },
        { 
            id: 5, 
            description: "Budget mein itni luxury amenities milna mushkil hai. Swimming pool area boht clean hai. Will visit again soon.", 
            image: "https://i.pravatar.cc/100?img=33", // Male
            name: "Daniel Victor", 
            company: "Solo Traveler" 
        },
        { 
            id: 6, 
            description: "Maine apni sister ke liye room book kiya tha, unki privacy aur security ka staff ne boht khayal rakha. Highly recommended.", 
            image: "https://i.pravatar.cc/100?img=32", // Female
            name: "Priya Malik", 
            company: "Verified Guest" 
        },
        { 
            id: 7, 
            description: "Excellent location, right in the center of the city. Easy access to all main spots. Room was spacious and bed was very soft.", 
            image: "https://i.pravatar.cc/100?img=11", // Male
            name: "Thomas Shelby", 
            company: "International Tourist" 
        },
    
        { 
            id: 9, 
            description: "Parking space bari hai aur security 24/7 active rehti hai. It's a safe place for families and solo female travelers too.", 
            image: "https://i.pravatar.cc/100?img=13", // Male
            name: "Arjun Mehta", 
            company: "Corporate Guest" 
        }
    ]

    const columns = [
        { start: 0, end: 3, className: "animate-scroll-up-1" },
        { start: 3, end: 6, className: "hidden md:block animate-scroll-up-2" },
        { start: 6, end: 9, className: "hidden lg:block animate-scroll-up-3" }
    ]

    const renderCard = (testimonial, index) => (
        <div key={`${testimonial.id}-${index}`} className="bg-white border border-gray-100 rounded-3xl p-8 mb-6 hover:border-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-100/50 transition-all duration-500 group">
            <div className="mb-6 flex justify-between items-start">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-indigo-600">
                    <path fill="currentColor" d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H16.017C14.9124 8 14.017 7.10457 14.017 6V5C14.017 3.89543 14.9124 3 16.017 3H19.017C21.2261 3 23.017 4.79086 23.017 7V15C23.017 18.3137 20.3307 21 17.017 21H14.017ZM1 21L1 18C1 16.8954 1.89543 16 3 16H6C6.55228 16 7 15.5523 7 15V9C7 8.44772 6.55228 8 6 8H3C1.89543 8 1 7.10457 1 6V5C1 3.89543 1.89543 3 3 3H6C8.20914 3 10 4.79086 10 7V15C10 18.3137 7.31371 21 4 21H1Z" />
                </svg>
                {/* Star Rating for realism */}
                <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    ))}
                </div>
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed italic group-hover:text-gray-900 transition-colors">
                "{testimonial.description}"
            </p>
            <div className="flex items-center gap-4 pt-4 border-t border-gray-50">
                <img src={testimonial.image} alt={testimonial.name} className="size-12 rounded-full border-2 border-indigo-50 shadow-sm group-hover:scale-110 transition-transform duration-500" />
                <div>
                    <p className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{testimonial.name}</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">{testimonial.company}</p>
                </div>
            </div>
        </div>
    )
  return (
   <>
   <style>
                {`
                    @keyframes scroll-up {
                        0% { transform: translateY(0); }
                        100% { transform: translateY(-50%); }
                    }
                    .animate-scroll-up-1 { animation: scroll-up 30s linear infinite; }
                    .animate-scroll-up-2 { animation: scroll-up 40s linear infinite; }
                    .animate-scroll-up-3 { animation: scroll-up 25s linear infinite; }
                    .animate-scroll-up-1:hover, .animate-scroll-up-2:hover, .animate-scroll-up-3:hover {
                        animation-play-state: paused;
                    }
                `}
            </style>

            <div className="bg-[#fcfcfd] flex flex-col items-center justify-center py-24 px-6 overflow-hidden">
                <div className="text-center mb-20 max-w-2xl">
                    <span className="text-indigo-600 text-xs font-bold uppercase tracking-[0.4em] mb-4 block">Our Reviews</span>
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">
                        What Our <span className="text-indigo-600">Guests Say</span>
                    </h2>
                    <p className="text-gray-500 leading-relaxed">
                        Join over 100+ satisfied guests who have experienced the luxury and comfort of our hotel. Your satisfaction is our priority.
                    </p>
                </div>

                <div className="relative w-full max-w-7xl">
                    <div className="absolute top-0 left-0 right-0 h-32 bg-linear-to-b from-[#fcfcfd] via-[#fcfcfd]/80 to-transparent z-10 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-[#fcfcfd] via-[#fcfcfd]/80 to-transparent z-10 pointer-events-none"></div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 h-170 overflow-hidden px-2">
                        {columns.map((col, colIndex) => (
                            <div key={colIndex} className={`${col.className} flex flex-col`}>
                                {[...testimonials.slice(col.start, col.end), ...testimonials.slice(col.start, col.end)].map((testimonial, index) =>
                                    renderCard(testimonial, index)
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
   
   
   </>
  )
}

export default Reviews
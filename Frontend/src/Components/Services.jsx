import React from "react";

const services = [
  {
    id: 1,
    title: "Daily Cleaning",
    desc: "Our staff ensures your room is sparkling clean every single day.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    id: 2,
    title: "Delicious Food",
    desc: "Enjoy world-class cuisines prepared by our expert chefs.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    id: 3,
    title: "Pick & Drop",
    desc: "Premium car service for your airport and city travels.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
  },
  {
    id: 4,
    title: "Free Wi-Fi",
    desc: "Stay connected with high-speed internet in every corner.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {/* NEW CLEAN WI-FI ICON */}
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.642 12.518a11.077 11.077 0 0114.716 0M7.33 15.206a7.077 7.077 0 019.34 0M12 18.51l.01-.011" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1.954 9.83a15.077 15.077 0 0120.092 0" />
      </svg>
    ),
  },
];

const Services = () => {
  return (
    <section className="py-20 bg-[#F9FAFB] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Heading */}
        <div className="text-center mb-16 opacity-0 animate-fade-up">
          <span className="text-indigo-600 font-bold uppercase tracking-widest text-xs">Our Amenities</span>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mt-3">Special Services For You</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((item, index) => (
            <div 
              key={item.id} 
              // 'opacity-0' lazmi lagayein taake animation se pehle card nazar na aaye
              className="opacity-0 animate-fade-up group bg-white p-8 rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:-translate-y-3 cursor-pointer"
              style={{ 
                animationDelay: `${index * 200}ms`, // Pehle card ke baad doosra 0.2s baad aayega
                animationFillMode: 'forwards' // Yeh card ko screen par rok kar rakhega
              }}
            >
              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-500 group-hover:rotate-[360deg">
                {item.icon}
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">
                {item.title}
              </h3>
              
              <p className="text-gray-500 text-sm leading-relaxed">
                {item.desc}
              </p>

              <div className="w-8 h-1 bg-indigo-600 mt-6 rounded-full transition-all duration-500 group-hover:w-full"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
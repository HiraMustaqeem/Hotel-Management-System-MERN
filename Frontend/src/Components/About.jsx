import React from "react";

const About = () => {
  return (
    <section className="py-16 md:py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* LEFT SIDE: Image Grid */}
          <div className="grid grid-cols-2 gap-4 relative">
            {/* Background Decorative Box */}
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-indigo-50 rounded-2xl -z-10"></div>
            
            <div className="space-y-4">
              <img 
                src="https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80" 
                alt="Luxury Room" 
                className="w-full h-48 md:h-64 object-cover rounded-2xl shadow-lg hover:scale-105 transition-transform duration-500"
              />
              <img 
                src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80" 
                alt="Hotel Lobby" 
                className="w-full h-32 md:h-48 object-cover rounded-2xl shadow-lg hover:scale-105 transition-transform duration-500"
              />
            </div>
            
            <div className="space-y-4 pt-8">
              <img 
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80" 
                alt="Hotel Exterior" 
                className="w-full h-32 md:h-48 object-cover rounded-2xl shadow-lg hover:scale-105 transition-transform duration-500"
              />
              <img 
                src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80" 
                alt="Swimming Pool" 
                className="w-full h-48 md:h-64 object-cover rounded-2xl shadow-lg hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Experience Badge */}
            <div className="absolute bottom-10 -right-4 bg-indigo-600 text-white p-6 rounded-2xl shadow-2xl hidden md:block">
              <p className="text-3xl font-bold">6+</p>
              <p className="text-xs uppercase tracking-widest opacity-80">Years of<br />Excellence</p>
            </div>
          </div>

          {/* RIGHT SIDE: Content */}
          <div className="lg:pl-10">
            <span className="text-indigo-600 font-bold uppercase tracking-[4px] text-sm">Since 2020</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-4 leading-tight">
              We Provide Best Luxury Rooms For Your <span className="text-indigo-600">Perfect Stay.</span>
            </h2>
            
            <p className="text-gray-600 mt-6 text-base leading-relaxed">
              Luxury Stay has been redefining comfort since 2020. We believe that a hotel is more than just a place to sleep; it’s an experience. From our world-class amenities to our personalized services, we ensure every guest feels like royalty.
            </p>

            {/* Stats / Satisfaction Info */}
            <div className="grid grid-cols-2 gap-8 mt-10">
              <div className="border-l-4 border-indigo-600 pl-4">
                <h4 className="text-2xl font-bold text-gray-900">10k+</h4>
                <p className="text-sm text-gray-500">Satisfied Guests</p>
              </div>
              <div className="border-l-4 border-indigo-600 pl-4">
                <h4 className="text-2xl font-bold text-gray-900">100%</h4>
                <p className="text-sm text-gray-500">Service Quality</p>
              </div>
            </div>

            <button className="mt-10 bg-gray-900 text-white px-8 py-3.5 rounded-full text-sm font-bold uppercase tracking-wider hover:bg-indigo-600 transition-all duration-300 shadow-xl active:scale-95">
              Explore Our Story
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;
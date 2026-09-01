import React from "react";
import { useNavigate } from "react-router-dom"; // Navigation hook import kiya
import hero from "../assets/hero.jpg";

function Hero() {
  const navigate = useNavigate(); // Hook ko initialize kiya

  return (
    <main className="grow flex flex-col items-center max-w-7xl mx-auto w-full">
      {/* Top Badge Button */}
      <button className="mt-16 mb-6 flex items-center space-x-2 border border-indigo-600 text-indigo-600 text-xs rounded-full px-4 pr-1.5 py-1.5 hover:bg-indigo-50 transition" type="button">
        <span>Luxury Stay Your trusted comfort partner</span>
        <span className="flex items-center justify-center size-6 p-1 rounded-full bg-indigo-600">
          <svg width={14} height={11} viewBox="0 0 16 13" fill="none">
            <path d="M1 6.5h14M9.5 1 15 6.5 9.5 12" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>

      {/* Main Heading */}
      <h1 className="text-center text-gray-900 font-bold text-3xl sm:text-4xl md:text-5xl max-w-2xl leading-tight">
        <span className="italic">LUXURY STAY</span> is a Complete Package {" "}
        <span className="text-indigo-600">for a Memorable Experience</span>
      </h1>

      {/* Subtext */}
      <p className="mt-4 text-center text-gray-600 max-w-md text-sm sm:text-base leading-relaxed">
        Learn why professionals trust our solution to complete their customer journey.
      </p>

      {/* Book Now Button Linked with Router */}
      <button 
        className="mt-6 relative inline-flex items-center justify-center px-7 py-2.5 overflow-hidden font-medium text-white transition-all duration-300 bg-indigo-600 rounded-full group shadow-md hover:bg-indigo-700 active:scale-95"
        type="button"
        onClick={() => navigate("/rooms")} // Click hone par book-now page pr le jayega
      >
        {/* Subtle Shine Effect */}
        <span className="absolute inset-0 w-full h-full -mt-1 transition-all duration-500 ease-out transform -translate-x-full bg-white opacity-10 group-hover:translate-x-0"></span>

        <div className="flex items-center gap-2 relative">
          <span className="text-sm uppercase tracking-wider">
            Book Now
          </span>
          
          {/* Minimalist Icon Box */}
          <span className="flex items-center justify-center w-6 h-6 bg-white/20 rounded-full backdrop-blur-sm group-hover:bg-white group-hover:text-indigo-600 transition-all duration-300">
            <svg 
              className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-45" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </span>
        </div>
      </button>

      {/* Hero Image Section */}
      <section className="w-full flex justify-center mt-10 px-4">
        {/* Tailwind arbitrary values fix kiya yahan */}
        <div className="w-full max-w-1400px rounded-3xl overflow-hidden border border-zinc-200 shadow-xl">
          <img
            src={hero}
            alt="Hero"
            className="w-full h-500px md:h-600px lg:h-700px object-cover"
          />
        </div>
      </section>
    </main>
  );
}

export default Hero;
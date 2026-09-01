import React from "react";

const Policies = () => {
  const policyList = [
    {
      title: "Check-in & Out",
      desc: "Check-in starts at 2:00 PM. Check-out is until 11:00 AM. Early check-in is subject to room availability.",
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: "Cancellation Policy",
      desc: "Free cancellation up to 48 hours before your arrival. Secure your stay with peace of mind.",
      icon: (
        /* CANCELLATION CROSS ICON */
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: "No Smoking",
      desc: "To maintain a fresh environment, smoking is strictly prohibited in all our rooms and indoor areas.",
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
      )
    },

    {
  title: "Valid Identification",
  desc: "A government-issued photo ID (Passport, CNIC, or License) is mandatory for all guests at check-in.",
  icon: (
    /* PROFESSIONAL PROFILE/USER ICON */
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-8 h-8">
      {/* Head Circle */}
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0z" />
      {/* Shoulders / Body */}
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  )
},
    
    {
      title: "Pet Policy",
      desc: "While we love animals, pets are currently not allowed in the hotel premises to ensure guest comfort.",
      icon: (
        /* PET PAW ICON */
        <svg fill="currentColor" viewBox="0 0 24 24" className="w-8 h-8">
          <path d="M8.5 7.5C9.32843 7.5 10 6.82843 10 6C10 5.17157 9.32843 4.5 8.5 4.5C7.67157 4.5 7 5.17157 7 6C7 6.82843 7.67157 7.5 8.5 7.5ZM15.5 7.5C16.3284 7.5 17 6.82843 17 6C17 5.17157 16.3284 4.5 15.5 4.5C14.6716 4.5 14 5.17157 14 6C14 6.82843 14.6716 7.5 15.5 7.5ZM5 12C5.82843 12 6.5 11.3284 6.5 10.5C6.5 9.67157 5.82843 9 5 9C4.17157 9 3.5 9.67157 3.5 10.5C3.5 11.3284 4.17157 12 5 12ZM19 12C19.8284 12 20.5 11.3284 20.5 10.5C20.5 9.67157 19.8284 9 19 9C18.1716 9 17.5 9.67157 17.5 10.5C17.5 11.3284 18.1716 12 19 12ZM12 11C10.067 11 8.5 12.567 8.5 14.5C8.5 15.8 9.3 17.1 10.5 18.2C11.3 18.9 12.7 18.9 13.5 18.2C14.7 17.1 15.5 15.8 15.5 14.5C15.5 12.567 13.933 11 12 11Z" />
        </svg>
      )
    },
   {
  title: "Extra Bedding",
  desc: "Need more space? Extra beds and baby cots are available upon request for a small additional fee.",
  icon: (
    /* CLEAN SINGLE BED ICON */
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-8 h-8">
      {/* Bed Frame and Mattress */}
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 11V18M21 11V18M2 14h20M2 18h20M4 18v2M20 18v2" />
      {/* Headboard */}
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 14V7a2 2 0 012-2h12a2 2 0 012 2v7" />
     
    </svg>
  )
}
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="mb-20">
          <div className="flex items-center gap-4 mb-4">
            <span className="h-px w-12 bg-indigo-600"></span>
            <span className="text-indigo-600 font-bold uppercase tracking-widest text-xs">Stay Guidelines</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
            Policies & <span className="text-indigo-600 underline decoration-indigo-100 underline-offset-8">Commitments</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {policyList.map((policy, index) => (
            <div 
              key={index} 
              // Animation and Color Change on Hover
              className="group p-8 rounded-[2.5rem] bg-gray-50 border border-transparent hover:bg-indigo-600 hover:-translate-y-4 transition-all duration-500 cursor-pointer shadow-sm hover:shadow-2xl hover:shadow-indigo-200"
            >
              <div className="w-16 h-16 rounded-2xl bg-white text-indigo-600 group-hover:bg-white/20 group-hover:text-white flex items-center justify-center transition-all duration-500 mb-8 shadow-sm">
                {policy.icon}
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-white transition-colors">
                {policy.title}
              </h3>
              
              <p className="text-gray-500 text-sm leading-relaxed font-medium group-hover:text-indigo-50 transition-colors">
                {policy.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Policies;
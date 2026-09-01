import React, { useEffect, useState } from "react";
import API from "../api/axios";

const ManagerServices = () => {

  const [services, setServices] = useState([]);


  // =========================================
  // FETCH ALL SERVICES
  // =========================================
  const fetchServices = async () => {

    try {

      const res = await API.get("/service/all");

      setServices(res.data.services);

    } catch (error) {

      console.log("Fetch Services Error:", error?.response?.data);

      alert(
        error?.response?.data?.msg || "Failed to fetch services"
      );
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  
  return (
    <div className="min-h-screen p-6 text-slate-800 font-sans">

      {/* HEADER */}

      <div className="max-w-7xl mx-auto mb-10">
  <div className="rounded-3xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 p-8 text-white shadow-xl">
    
    <p className="uppercase tracking-[4px] text-xs font-bold text-indigo-100">
      Luxury Stay
    </p>

    <h1 className="text-4xl font-black mt-2">
      Hotel Services Directory
    </h1>

    <p className="text-indigo-100 mt-3 max-w-2xl">
      Browse all available premium services offered by the hotel.
      This section is view-only for managers.
    </p>

    <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-semibold">
      Total Services: {services.length}
    </div>

  </div>
</div>
      

      {/* SERVICES GRID */}
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {services.map((service) => (

          <div>
<div
  key={service._id}
  className="group relative overflow-hidden rounded-3xl bg-white border border-slate-200/70 p-6 shadow-[0_10px_30px_-12px_rgba(15,23,42,0.15)] hover:shadow-[0_20px_40px_-12px_rgba(94,74,247,0.25)] hover:-translate-y-1 transition-all duration-300"
>
  {/* Gradient Top Bar */}
  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500" />

  {/* Icon + Status */}
  <div className="flex items-start justify-between mb-5">
    
    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center">
      <svg
        className="w-7 h-7 text-indigo-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 8c-1.657 0-3 1.343-3 3v2H7a2 2 0 00-2 2v1h14v-1a2 2 0 00-2-2h-2v-2c0-1.657-1.343-3-3-3z"
        />
      </svg>
    </div>

    <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[11px] font-bold border border-emerald-100">
      Available
    </span>
  </div>

  {/* Service Name */}
  <h3 className="text-lg font-black text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
    {service.name}
  </h3>

  {/* Price */}
  <div className="flex items-center gap-2 mb-4">
    <span className="text-3xl font-black text-indigo-600">
      ${service.price}
    </span>

    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
      Service Fee
    </span>
  </div>

  {/* Description */}
  <p className="text-sm text-slate-500 leading-relaxed min-h-[72px]">
    {service.description || "No description available for this service."}
  </p>

  {/* Footer */}
  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
    
    <div className="flex items-center gap-2">
      <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
      <span className="text-xs font-semibold text-slate-500">
        Hotel Service
      </span>
    </div>

  
  </div>
</div>

            {/* FOOTER */}
            <div className="mt-5 pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] font-semibold tracking-wider uppercase">

           
              
            </div>
          </div>
        ))}
      </div>

   
    </div>
  );
};

export default ManagerServices;
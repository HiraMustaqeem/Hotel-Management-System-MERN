import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
const ReceptionistLogout = () => {
   const navigate = useNavigate();

    useEffect(() => {
        // 1. Clear authentication data from storage
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        
        // Agar aap SessionStorage use kar rahe hain toh isko uncomment kar dein:
        // sessionStorage.clear();

        console.log("Session cleared. Logging out...");

        // 2. Short delay for smooth UI transition then redirect to home/login
        const timer = setTimeout(() => {
            navigate("/managementLogin", { replace: true }); // 'replace: true' taake user back press karke wapas na aa sake
            
            // Agar full page reload chahiye state reset karne ke liye:
            // window.location.reload();
        }, 1500);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 font-sans text-sm text-gray-500">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center max-w-xs w-full space-y-4">
                
                {/* Modern Spinning/Pulse Ring Loader */}
                <div className="relative w-12 h-12 mx-auto flex items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-rose-400 opacity-25"></span>
                    <div className="w-10 h-10 border-4 border-rose-100 border-t-rose-500 rounded-full animate-spin"></div>
                </div>

                <div className="space-y-1">
                    <h3 className="text-gray-900 font-black text-base tracking-tight">Logging You Out</h3>
                    <p className="text-xs text-gray-400 font-medium">Clearing secure session data...</p>
                </div>

            </div>
        </div>
    );
};
export default ReceptionistLogout;
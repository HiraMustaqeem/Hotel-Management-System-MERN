import React from "react";
import { useNavigate } from "react-router-dom";
function Atmcard() 

{
    const navigate = useNavigate(); // Hook ko function ke andar initialize kiya
    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
            
                * {
                    font-family: 'Poppins', sans-serif;
                }
            `}</style>
            
            <div className="flex flex-col items-center justify-center min-h-screen py-16 px-4">
                
                {/* Top Heading Section */}
                <div className="text-center mb-12 max-w-2xl">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                        Online Booking Available
                    </h2>
                    <p className="text-slate-600 text-base">
                        We have online booking available. Plus point: You can pay with your credit card securely and enjoy seamless transactions.
                    </p>
                </div>

                {/* Main Feature Section */}
                <div className="flex flex-col lg:flex-row items-center justify-center gap-12 w-full max-w-7xl mb-16">
                    <img className="max-w-xl w-full rounded-2xl " src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/features/card-image-1.png" alt="" />
                    
                    <div className="space-y-8 px-4 md:px-0">
                        {/* Card 1 */}
                        <div className="flex items-start gap-4 max-w-xs">
                            <div className="p-3 aspect-square  rounded-full shrink-0">
                                <svg width="18" height="18" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M14 18.667V24.5m4.668-8.167V24.5m4.664-12.833V24.5m2.333-21L15.578 13.587a.584.584 0 0 1-.826 0l-3.84-3.84a.583.583 0 0 0-.825 0L2.332 17.5M4.668 21v3.5m4.664-8.167V24.5" stroke="#7F22FE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-sm font-bold text-slate-700 leading-tight">Real-Time Analytics</h3>
                                <p className="text-[12px] text-slate-500 leading-snug">Get instant insights into your finances with live dashboards.</p>
                                <button className="text-[10px] font-bold text-violet-600 uppercase tracking-tighter">View Analytics →</button>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="flex items-start gap-4 max-w-xs">
                            <div className="p-3 aspect-square bg-green-100 rounded-full shrink-0">
                                <svg width="18" height="18" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M14 11.667A2.333 2.333 0 0 0 11.667 14c0 1.19-.117 2.929-.304 4.667m4.972-3.36c0 2.776 0 7.443-1.167 10.36m5.004-1.144c.14-.7.502-2.683.583-3.523M2.332 14a11.667 11.667 0 0 1 21-7m-21 11.667h.01m23.092 0c.233-2.333.152-6.246 0-7" stroke="#00A63E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M5.832 22.75C6.415 21 6.999 17.5 6.999 14a7 7 0 0 1 .396-2.333m2.695 13.999c.245-.77.525-1.54.665-2.333m-.255-15.4A7 7 0 0 1 21 14v2.333" stroke="#00A63E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-sm font-bold text-slate-700 leading-tight">Bank-Grade Security</h3>
                                <p className="text-[12px] text-slate-500 leading-snug">End-to-end encryption, 2FA, compliance with GDPR standards.</p>
                                <button className="text-[10px] font-bold text-green-600 uppercase tracking-tighter">Check Security →</button>
                            </div>
                        </div>

                        {/* Card 3 */}
                        <div className="flex items-start gap-4 max-w-xs">
                            <div className="p-3 aspect-square bg-orange-100 rounded-full shrink-0">
                                <svg width="18" height="18" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4.668 25.666h16.333a2.333 2.333 0 0 0 2.334-2.333V8.166L17.5 2.333H7a2.333 2.333 0 0 0-2.333 2.333v4.667" stroke="#F54900" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M16.332 2.333V7a2.334 2.334 0 0 0 2.333 2.333h4.667m-21 8.167h11.667M10.5 21l3.5-3.5-3.5-3.5" stroke="#F54900" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-sm font-bold text-slate-700 leading-tight">Customizable Reports</h3>
                                <p className="text-[12px] text-slate-500 leading-snug">Export professional, audit-ready financial reports for tax review.</p>
                                <button className="text-[10px] font-bold text-orange-600 uppercase tracking-tighter">Download Reports →</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Action Button with Card Icons */}
                {/* <button className="flex items-center gap-4 bg-slate-900 hover:bg-black text-white px-10 py-4 rounded-2xl transition-all shadow-xl active:scale-95 group">
                    <span className="font-bold text-lg">Book Now</span>
                    <div className="h-6 w-1px bg-slate-700 mx-2"></div>
                    <div className="flex gap-2">
                        <img src="https://img.icons8.com/color/48/visa.png" className="h-5 opacity-90 group-hover:opacity-100 transition-opacity" alt="Visa" />
                        <img src="https://img.icons8.com/color/48/mastercard.png" className="h-5 opacity-90 group-hover:opacity-100 transition-opacity" alt="Mastercard" />
                    </div>
                </button> */}
                <button 
            onClick={() => navigate("/rooms")} // Click hone par booking/rooms page par bhejega
            className="flex items-center gap-4 bg-slate-900 hover:bg-black text-white px-10 py-4 rounded-2xl transition-all shadow-xl active:scale-95 group"
            type="button"
        >
            <span className="font-bold text-lg">Book Now</span>
            <div className="h-6 w-1px bg-slate-700 mx-2"></div>
            <div className="flex gap-2">
                <img src="https://img.icons8.com/color/48/visa.png" className="h-5 opacity-90 group-hover:opacity-100 transition-opacity" alt="Visa" />
                <img src="https://img.icons8.com/color/48/mastercard.png" className="h-5 opacity-90 group-hover:opacity-100 transition-opacity" alt="Mastercard" />
            </div>
        </button>

            </div>
        </>
    );
};

export default Atmcard;
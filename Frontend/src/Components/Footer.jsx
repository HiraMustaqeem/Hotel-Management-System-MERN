
import React from "react";
import { Link } from "react-router-dom";

function Footer() {
    return (
        /* Footer Wrapper: Isme margin aur padding di hai taake border sahi dikhe */
        <footer className="w-full bg-white py-10 px-4 md:px-10">
            
            {/* Main Bordered Container */}
            <div className="max-w-7xl mx-auto border border-slate-200 shadow-sm rounded-[2.5rem] bg-white overflow-hidden">
                
                <div className="px-8 md:px-16 py-12">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-14">
                        
                        {/* Brand Section */}
                        <div className="sm:col-span-2 lg:col-span-1">
                            <Link to="/" className="text-2xl font-bold text-indigo-600 italic tracking-tight">
                                Luxury Stay
                            </Link>
                            <p className="text-sm/7 mt-6 max-w-sm text-slate-600">
                                Experience elegance and premium hospitality. Luxury Stay offers 
                                handpicked accommodations designed to provide comfort and 
                                sophistication for your next getaway.
                            </p>
                        </div>

                        {/* Navigation Links */}
                        <div className="flex flex-col lg:items-center">
                            <div className="flex flex-col text-sm space-y-3">
                                <h2 className="font-semibold mb-4 text-gray-900 uppercase tracking-widest text-[11px]">Navigation</h2>
                                <Link className="hover:text-indigo-600 transition-colors" to="/">Home</Link>
                                <Link className="hover:text-indigo-600 transition-colors" to="/aboutus">About us</Link>
                                <Link className="hover:text-indigo-600 transition-colors" to="/rooms">Our Rooms</Link>
                                <Link className="hover:text-indigo-600 transition-colors" to="/reviews">Guest Reviews</Link>
                            
                            </div>
                        </div>

                        {/* Newsletter Section */}
                        <div>
                            <h2 className="font-semibold text-gray-900 mb-5 uppercase tracking-widest text-[11px]">Stay Updated</h2>
                            <div className="text-sm space-y-6 max-w-sm">
                                <p className="text-slate-600">Join our mailing list for exclusive offers and seasonal discounts.</p>
                                <div className="flex items-center">
                                    <input 
                                        className="rounded-l-full bg-slate-50 outline-none w-full h-11 px-5 border border-slate-200 focus:border-indigo-300 transition-all" 
                                        type="email" 
                                        placeholder="Email address" 
                                    />
                                    <button className="bg-indigo-600 cursor-pointer hover:bg-indigo-700 transition-all px-6 h-11 text-white rounded-r-full font-medium shadow-sm">
                                        Join
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Bar (Inside the border) */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 py-8 border-t mt-16 border-slate-100">
                        <p className="text-center md:text-left text-slate-500">
                            Copyright {new Date().getFullYear()} © <span className="font-semibold text-indigo-600 italic">Luxury Stay</span>. All Rights Reserved.
                        </p>
                        
                        <div className="flex items-center gap-6 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                            <Link className="hover:text-indigo-600 transition" to="/privacy">Privacy Policy</Link>
                            <Link className="hover:text-indigo-600 transition" to="/terms">Terms</Link>
                            <Link className="hover:text-indigo-600 transition" to="/cookies">Cookies</Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
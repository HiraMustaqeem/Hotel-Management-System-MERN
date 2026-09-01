import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import { registerGuest } from "../api/authService";
function Register() {
    const navigate = useNavigate();
    const [showPass, setShowPass] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false); // Success message state
    
    // Form data states
    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        email: "",
        password: ""
    });

    // Error states for validation messages
    const [errors, setErrors] = useState({});

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        
        // Input karte hi error remove karne ke liye
        if (errors[name]) {
            setErrors({ ...errors, [name]: "" });
        }
    };

    // Validation Logic
    const validateForm = () => {
        let localErrors = {};
        let isValid = true;

        // 1. Name Validation (Sirf letters aur spaces)
        const nameRegex = /^[A-Za-z\s]+$/;
        if (!formData.fullName.trim()) {
            localErrors.fullName = "Name is required";
            isValid = false;
        } else if (!nameRegex.test(formData.fullName)) {
            localErrors.fullName = "Name can only contain alphabets and spaces";
            isValid = false;
        }

        // 2. Phone Validation (Sirf numbers, minimum 10 digits)
        const phoneRegex = /^[0-9]+$/;
        if (!formData.phone.trim()) {
            localErrors.phone = "Phone number is required";
            isValid = false;
        } else if (!phoneRegex.test(formData.phone)) {
            localErrors.phone = "Phone number must contain numbers only";
            isValid = false;
        } else if (formData.phone.length < 10) {
            localErrors.phone = "Phone number must be at least 10 digits";
            isValid = false;
        }

        // 3. Password Validation (Min 8 characters, at least 1 letter and 1 number)
        const passRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
        if (!formData.password) {
            localErrors.password = "Password is required";
            isValid = false;
        // } else if (!passRegex.test(formData.password)) {
        //     localErrors.password = "Password must be at least 6 characters with 1 letter and 1 number";
        //     isValid = false;
        }

        setErrors(localErrors);
        return isValid;
    };

    // Form Submit Handler
const handleSubmit = async (e) => {

    e.preventDefault();

    if (validateForm()) {

        try {

            const payload = {

                name: formData.fullName,

                email: formData.email,

                password: formData.password,

                contactNumber: formData.phone
            };

            const response =
                await registerGuest(payload);

            console.log(response);

            setIsSubmitted(true);

            setFormData({
                fullName: "",
                phone: "",
                email: "",
                password: ""
            });

            // 2 sec baad login page pr redirect
            setTimeout(() => {

                navigate("/login");

            }, 2000);

        } catch (error) {

            console.log(error);

            alert(
                error?.response?.data?.msg ||
                "Unable to create account. Please try again."
            );
        }
    }
};
    return (
        /* Outer Container: Centers the card on full screen */
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50 px-4 py-10 relative">
            
            {/* SUCCESS ALERT */}
            {isSubmitted && (
                <div className="mb-6 max-w-96 w-full bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex items-center gap-3 animate-fade-in shadow-sm">
                    <div className="bg-emerald-500 text-white rounded-full p-1.5 flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <div>
                        <h4 className="font-bold text-emerald-900 text-xs uppercase tracking-wider">Registration Success!</h4>
                        <p className="text-emerald-700 text-xs mt-0.5 font-medium">Thank you! We will contact you soon.</p>
                    </div>
                </div>
            )}

            {/* Main Card */}
            <div className="bg-white text-gray-500 max-w-96 w-full md:p-8 p-6 text-left text-sm rounded-2xl shadow-[0px_10px_30px_-10px_rgba(0,0,0,0.1)]">
                
                {/* Header Section */}
                <h2 className="text-2xl font-bold text-center text-gray-800">Create Account</h2>
                <p className="text-center text-gray-500 mt-1 mb-6">
                    Already have an account? 
                    <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-bold ml-1 hover:underline">Login</Link>
                </p>
                
                <form onSubmit={handleSubmit} noValidate>
                    {/* Full Name Input */}
                    <div className="relative mb-3">
                        <label className="block text-xs font-semibold text-gray-400 ml-4 mb-1">Full Name</label>
                        <div className="relative">
                            <input 
                                className={`w-full bg-gray-50 border ${errors.fullName ? "border-red-400 focus:border-red-400" : "border-gray-200 focus:border-indigo-400"} focus:bg-white outline-none rounded-full py-2.5 px-5 pr-10 transition-all text-gray-800`} 
                                type="text" 
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="John Doe" 
                                required 
                            />
                            <svg className="absolute right-4 top-3.5 w-4 h-4 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        {errors.fullName && <p className="text-red-500 text-[11px] ml-4 mt-0.5">{errors.fullName}</p>}
                    </div>

                    {/* Phone Number Input */}
                    <div className="relative mb-3">
                        <label className="block text-xs font-semibold text-gray-400 ml-4 mb-1">Phone Number</label>
                        <div className="relative">
                            <input 
                                className={`w-full bg-gray-50 border ${errors.phone ? "border-red-400 focus:border-red-400" : "border-gray-200 focus:border-indigo-400"} focus:bg-white outline-none rounded-full py-2.5 px-5 pr-10 transition-all text-gray-800`} 
                                type="tel" 
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="03XXXXXXXXX" 
                                required 
                            />
                            <svg className="absolute right-4 top-3.5 w-4 h-4 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.72l.54 2.21a1 1 0 01-.24.97l-1.27 1.27a15.91 15.91 0 006.72 6.72l1.27-1.27a1 1 0 01.97-.24l2.21.54a1 1 0 01.72.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                        </div>
                        {errors.phone && <p className="text-red-500 text-[11px] ml-4 mt-0.5">{errors.phone}</p>}
                    </div>

                    {/* Email Input */}
                    <div className="relative mb-3">
                        <label className="block text-xs font-semibold text-gray-400 ml-4 mb-1">Email Address</label>
                        <div className="relative">
                            <input 
                                className="w-full bg-gray-50 border border-gray-200 focus:border-indigo-400 focus:bg-white outline-none rounded-full py-2.5 px-5 pr-10 transition-all text-gray-800" 
                                type="email" 
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="name@example.com" 
                                required 
                            />
                            <svg className="absolute right-4 top-3.5 w-4 h-4 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                    </div>

                    {/* Register Password Input */}
                    <div className="relative mb-6">
                        <label className="block text-xs font-semibold text-gray-400 ml-4 mb-1">Password</label>
                        <div className="relative">
                            <input 
                                className={`w-full bg-gray-50 border ${errors.password ? "border-red-400 focus:border-red-400" : "border-gray-200 focus:border-indigo-400"} focus:bg-white outline-none rounded-full py-2.5 px-5 pr-12 transition-all text-gray-800`} 
                                type={showPass ? "text" : "password"} 
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••" 
                                required 
                            />
                            <button 
                                type="button" 
                                onClick={() => setShowPass(!showPass)}
                                className="absolute right-4 top-3.5 opacity-40 hover:opacity-100 transition-opacity text-gray-700"
                            >
                                {showPass ? (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                ) : (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.05 10.05 0 014.13-4.432m4.279-.583a10.051 10.051 0 014.134.583M18.9 18.9l-2-2m-2.828-2.828l-4.243-4.243M3 3l18 18" /></svg>
                                )}
                            </button>
                        </div>
                        {errors.password && <p className="text-red-500 text-[11px] ml-4 mt-0.5">{errors.password}</p>}
                    </div>

                    {/* Submit Button */}
                    <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all py-3 rounded-full text-white font-bold text-sm uppercase tracking-wider active:scale-95">
                        Register Now
                    </button>
                </form>

                {/* Divider */}
                <div className="flex items-center gap-3 my-6">
                    <div className="h-1px bg-gray-100 grow"></div>
                    <span className="text-[10px] font-bold text-gray-300 tracking-widest uppercase">Social Signup</span>
                    <div className="h-1px bg-gray-100 grow"></div>
                </div>

                {/* Social Button */}
                <div className="flex flex-col gap-3">
                    <button type="button" className="w-full flex items-center gap-3 justify-center bg-white border border-gray-200 py-2.5 rounded-full text-gray-700 hover:bg-gray-50 transition-all shadow-sm active:scale-95">
                        <img className="h-4 w-4" src="https://s3-alpha.figma.com/hub/file/3669549192/d975dba0-5367-4e32-a742-a4ffbfc72df3-cover.png" alt="google" />
                        <span className="font-medium text-xs">Sign up with Google</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Register;
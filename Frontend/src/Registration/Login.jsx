import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginGuest } from "../api/authService";
import API from "../api/axios";
function Login() {
    const [showPass, setShowPass] = useState(false);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });


    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await loginGuest(formData);

            // =========================
            // TOKEN SAVE
            // =========================
            if (response?.token) {
                localStorage.setItem("token", response.token);
            }

            // =========================
            // ROLE SAVE (safe)
            // =========================
            localStorage.setItem(
                "user",
                JSON.stringify({
                    role: response?.role || "guest"
                })
            );

            alert("Login Successful");

            navigate("/");

        } catch (error) {
            console.log(error);
            alert(error?.response?.data?.msg || "Invalid Credentials! Check your email and password.");
        }
    };

    return (
        /* Full Screen Center Wrapper */
        <div className="min-h-screen w-full flex items-center justify-center bg-[#F8FAFC] px-4">

            <div className="bg-white text-gray-600 max-w-96 w-full md:p-10 p-6 rounded-2rem shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-gray-50">

                <div className="text-center mb-8">
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                        Welcome Back
                    </h2>
                    <p className="text-sm text-gray-400 mt-1">
                        Enter your details to access your account
                    </p>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit}>

                    {/* EMAIL */}
                    <div className="relative">
                        <input
                            className="w-full bg-gray-50 border border-transparent focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 outline-none rounded-2xl py-3 px-5 pr-12 transition-all placeholder:text-gray-400 text-sm text-gray-800"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email Address"
                            required
                        />

                        <div className="absolute right-4 top-3.5 text-gray-400 pointer-events-none opacity-60">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                />
                            </svg>
                        </div>
                    </div>

                    {/* PASSWORD */}
                    <div className="relative">
                        <input
                            className="w-full bg-gray-50 border border-transparent focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 outline-none rounded-2xl py-3 px-5 pr-12 transition-all placeholder:text-gray-400 text-sm text-gray-800"
                            type={showPass ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Password"
                            required
                        />

                        <button
                            type="button"
                            onClick={() => setShowPass(!showPass)}
                            className="absolute right-4 top-3.5 text-gray-400 hover:text-indigo-600 transition-colors"
                        >
                            {showPass ? (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                            ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.05 10.05 0 014.13-4.432m4.279-.583a10.051 10.051 0 014.134.583M18.9 18.9l-2-2m-2.828-2.828l-4.243-4.243M3 3l18 18" /></svg>
                            )}
                        </button>
                    </div>
<div className="flex justify-end mt-2">

    <Link
        to="/forgot-password"
        className="text-xs text-indigo-600 font-semibold hover:underline"
    >
        Forgot Password?
    </Link>

</div>
                    {/* LOGIN BUTTON */}
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all py-3.5 rounded-2xl text-white font-bold text-xs uppercase tracking-widest mt-2 active:scale-95"
                    >
                        Sign In
                    </button>

                </form>

                {/* DIVIDER */}
                <div className="relative flex py-6 items-center">
                    <div className="grow border-t border-gray-100"></div>
                    <span className="shrink mx-4 text-gray-300 text-[10px] font-bold uppercase tracking-tighter">
                        Secure Login
                    </span>
                    <div className="grow border-t border-gray-100"></div>
                </div>

                {/* GOOGLE */}
                <div className="space-y-3">
                    <button className="w-full flex items-center justify-center py-3 px-4 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 hover:border-gray-200 transition-all gap-3 shadow-sm active:scale-95">

                        <img className="h-4 w-4" src="https://s3-alpha.figma.com/hub/file/3669549192/d975dba0-5367-4e32-a742-a4ffbfc72df3-cover.png" alt="google" />


                        <span className="text-xs font-bold text-gray-700">
                            Continue with Google
                        </span>
                    </button>
                </div>

                {/* REGISTER */}
                <p className="text-center mt-8 text-sm text-gray-400">
                    Don't have an account?
                    <Link to="/register" className="text-indigo-600 font-bold ml-1 hover:underline">
                        Create one
                    </Link>
                </p>

            </div>
        </div>
    );
}

export default Login;
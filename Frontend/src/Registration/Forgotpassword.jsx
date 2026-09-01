import React, { useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";

function Forgotpassword() {

    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    // ==============================
    // HANDLE INPUT
    // ==============================
    const handleChange = (e) => {
        setEmail(e.target.value);

        if (error) {
            setError("");
        }

        // alert hide on new typing
        if (isSubmitted) {
            setIsSubmitted(false);
        }
    };

    // ==============================
    // SUBMIT
    // ==============================
    const handleSubmit = async (e) => {
        e.preventDefault();

        const emailRegex =
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        const trimmedEmail = email.trim();

        // validation
        if (!trimmedEmail) {
            setError("Email address is required");
            return;
        }

        if (!emailRegex.test(trimmedEmail)) {
            setError("Please enter a valid email address");
            return;
        }

        try {
            setLoading(true);

            const response = await API.post(
                "/guest/forgot-password",
                { email: trimmedEmail }
            );

            console.log("Forgot Password Response:", response.data);

            setIsSubmitted(true);
            setEmail("");
            setError("");

            setTimeout(() => {
                setIsSubmitted(false);
            }, 6000);

        } catch (error) {
            console.log("Forgot Password Error:", error);

            setError(
                error?.response?.data?.msg ||
                "Failed to send reset link"
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50 px-4 py-10 relative">

            {/* SUCCESS MESSAGE */}
            {isSubmitted && (
                <div className="mb-6 max-w-96 w-full bg-indigo-50 border border-indigo-200 p-4 rounded-xl flex items-start gap-3 shadow-sm">

                    <div className="bg-indigo-600 text-white rounded-full p-1.5 flex items-center justify-center mt-0.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>

                    <div>
                        <h4 className="font-bold text-indigo-900 text-xs uppercase tracking-wider">
                            Check Your Inbox
                        </h4>

                        <p className="text-indigo-700 text-xs mt-1 leading-relaxed font-medium">
                            If this email exists, a reset link has been sent.
                        </p>
                    </div>
                </div>
            )}

            {/* CARD */}
            <div className="bg-white max-w-96 w-full p-6 md:p-8 rounded-2xl shadow-lg text-sm">

                <h2 className="text-2xl font-bold text-center text-gray-800">
                    Forgot Password?
                </h2>

                <p className="text-center text-gray-400 mt-1 mb-8">
                    Enter your email to receive reset link
                </p>

                <form onSubmit={handleSubmit}>

                    <div className="mb-5">

                        <label className="text-xs font-semibold text-gray-400 ml-3">
                            Email Address
                        </label>

                        <input
                            className={`w-full mt-1 bg-gray-50 border ${
                                error ? "border-red-400" : "border-gray-200"
                            } focus:border-indigo-500 rounded-full px-5 py-3 outline-none`}
                            type="email"
                            value={email}
                            onChange={handleChange}
                            placeholder="name@example.com"
                        />

                        {error && (
                            <p className="text-red-500 text-[11px] ml-3 mt-1">
                                {error}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-full font-bold disabled:opacity-60"
                    >
                        {loading ? "Sending..." : "Send Reset Link"}
                    </button>
                </form>

                <div className="text-center mt-6">
                    <Link
                        to="/login"
                        className="text-xs text-indigo-600 font-bold hover:underline"
                    >
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Forgotpassword;
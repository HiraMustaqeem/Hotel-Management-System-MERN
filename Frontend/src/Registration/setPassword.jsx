import React, { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import API from "../api/axios";

function SetPassword() {
    const [showPass, setShowPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: ""
    });

    const [errors, setErrors] = useState({});

    const navigate = useNavigate();
    const { token } = useParams();

    // ======================
    // HANDLE INPUT
    // ======================
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({ ...formData, [name]: value });

        if (errors[name] || errors.match) {
            setErrors({ ...errors, [name]: "", match: "" });
        }
    };

    // ======================
    // VALIDATION
    // ======================
    const validate = () => {
        let err = {};
        let valid = true;

        if (!formData.password) {
            err.password = "Password is required";
            valid = false;
        } else if (formData.password.length < 6) {
            err.password = "Password must be at least 6 characters";
            valid = false;
        }

        if (!formData.confirmPassword) {
            err.confirmPassword = "Confirm your password";
            valid = false;
        } else if (formData.password !== formData.confirmPassword) {
            err.match = "Passwords do not match";
            valid = false;
        }

        setErrors(err);
        return valid;
    };

    // ======================
    // SUBMIT
    // ======================
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        try {
            setLoading(true);

            await API.post("/guest/set-password", {
                token,
                password: formData.password
            });

            setSuccess(true);

            setTimeout(() => {
                navigate("/login");
            }, 2500);

        } catch (error) {
            alert(error?.response?.data?.msg || "Failed to set password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#f8fafc] px-4 py-10">

            {/* SUCCESS ALERT */}
            {success && (
                <div className="mb-6 max-w-96 w-full bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex items-start gap-3 shadow-sm">
                    <div className="bg-emerald-500 text-white rounded-full p-1.5 mt-0.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <h4 className="font-bold text-emerald-900 text-xs uppercase">
                            Success
                        </h4>
                        <p className="text-emerald-700 text-xs mt-1">
                            Password set successfully! Redirecting...
                        </p>
                    </div>
                </div>
            )}

            {/* CARD */}
            <div className="bg-white max-w-96 w-full md:p-8 p-6 rounded-2xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)]">

                <h2 className="text-2xl font-black text-center text-slate-900">
                    Set Password
                </h2>

                <p className="text-center text-slate-400 mt-1 mb-8 text-sm">
                    Create a secure password for your account
                </p>

                <form onSubmit={handleSubmit}>

                    {/* PASSWORD */}
                    <div className="mb-4">
                        <label className="text-xs text-slate-500 ml-2">Password</label>

                        <div className="relative mt-1">
                            <input
                                type={showPass ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className={`w-full bg-slate-50 border ${errors.password ? "border-rose-400" : "border-slate-200"} rounded-full py-2.5 px-5 pr-12 outline-none focus:border-[rgb(94,74,247)]`}
                            />

                            <button
                                type="button"
                                onClick={() => setShowPass(!showPass)}
                                className="absolute right-4 top-3 text-slate-500"
                            >
                                👁
                            </button>
                        </div>

                        {errors.password && (
                            <p className="text-rose-500 text-xs ml-2 mt-1">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    {/* CONFIRM PASSWORD */}
                    <div className="mb-6">
                        <label className="text-xs text-slate-500 ml-2">Confirm Password</label>

                        <div className="relative mt-1">
                            <input
                                type={showConfirmPass ? "text" : "password"}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className={`w-full bg-slate-50 border ${errors.confirmPassword || errors.match ? "border-rose-400" : "border-slate-200"} rounded-full py-2.5 px-5 pr-12 outline-none focus:border-[rgb(94,74,247)]`}
                            />

                            <button
                                type="button"
                                onClick={() => setShowConfirmPass(!showConfirmPass)}
                                className="absolute right-4 top-3 text-slate-500"
                            >
                                👁
                            </button>
                        </div>

                        {errors.confirmPassword && (
                            <p className="text-rose-500 text-xs ml-2 mt-1">
                                {errors.confirmPassword}
                            </p>
                        )}

                        {errors.match && (
                            <p className="text-rose-500 text-xs ml-2 mt-1">
                                {errors.match}
                            </p>
                        )}
                    </div>

                    {/* BUTTON */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[rgb(94,74,247)] hover:bg-indigo-700 text-white py-3 rounded-full font-bold transition-all"
                    >
                        {loading ? "Setting Password..." : "Set Password"}
                    </button>

                </form>

                {/* BACK */}
                <div className="text-center mt-5">
                    <Link to="/login" className="text-[rgb(94,74,247)] text-xs font-semibold hover:underline">
                        Back to Login
                    </Link>
                </div>

            </div>
        </div>
    );
}

export default SetPassword;
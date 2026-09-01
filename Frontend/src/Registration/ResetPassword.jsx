import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import API from "../api/axios";

function ResetPassword() {
    const [showNewPass, setShowNewPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        newPassword: "",
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
    const validateForm = () => {
        let localErrors = {};
        let isValid = true;

        if (!formData.newPassword) {
            localErrors.newPassword = "New password is required";
            isValid = false;
        } else if (formData.newPassword.length < 6) {
            localErrors.newPassword = "Password must be at least 6 characters";
            isValid = false;
        }

        if (!formData.confirmPassword) {
            localErrors.confirmPassword = "Please confirm your password";
            isValid = false;
        } else if (formData.newPassword !== formData.confirmPassword) {
            localErrors.match = "Passwords do not match!";
            isValid = false;
        }

        setErrors(localErrors);
        return isValid;
    };

    // ======================
    // SUBMIT
    // ======================
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            setLoading(true);

            await API.post(`/guest/reset-password/${token}`, {
                password: formData.newPassword
            });

            setIsSubmitted(true);

            setFormData({
                newPassword: "",
                confirmPassword: ""
            });

            setTimeout(() => {
                navigate("/login");
            }, 3000);

        } catch (error) {
            alert(
                error?.response?.data?.msg ||
                "Password reset failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50 px-4 py-10 relative">

            {/* SUCCESS ALERT */}
            {isSubmitted && (
                <div className="mb-6 max-w-96 w-full bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex items-start gap-3 shadow-sm">
                    <div className="bg-emerald-500 text-white rounded-full p-1.5 mt-0.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <h4 className="font-bold text-emerald-900 text-xs uppercase">
                            Success!
                        </h4>
                        <p className="text-emerald-700 text-xs mt-1">
                            Password reset successful! Redirecting...
                        </p>
                    </div>
                </div>
            )}

            {/* CARD */}
            <div className="bg-white max-w-96 w-full md:p-8 p-6 rounded-2xl shadow-[0px_10px_30px_-10px_rgba(0,0,0,0.1)]">

                <h2 className="text-2xl font-bold text-center text-gray-800">
                    Reset Password
                </h2>

                <p className="text-center text-gray-400 mt-1 mb-8 text-sm">
                    Enter your new password to secure your account
                </p>

                <form onSubmit={handleSubmit}>

                    {/* NEW PASSWORD */}
                    <div className="mb-4">
                        <label className="text-xs text-gray-500 ml-2">New Password</label>
                        <div className="relative mt-1">
                            <input
                                type={showNewPass ? "text" : "password"}
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className={`w-full bg-gray-50 border ${errors.newPassword ? "border-red-400" : "border-gray-200"} rounded-full py-2.5 px-5 pr-12 outline-none focus:border-indigo-400`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPass(!showNewPass)}
                                className="absolute right-4 top-3 text-gray-500"
                            >
                                👁
                            </button>
                        </div>
                        {errors.newPassword && (
                            <p className="text-red-500 text-xs ml-2 mt-1">{errors.newPassword}</p>
                        )}
                    </div>

                    {/* CONFIRM PASSWORD */}
                    <div className="mb-6">
                        <label className="text-xs text-gray-500 ml-2">Confirm Password</label>
                        <div className="relative mt-1">
                            <input
                                type={showConfirmPass ? "text" : "password"}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className={`w-full bg-gray-50 border ${errors.confirmPassword || errors.match ? "border-red-400" : "border-gray-200"} rounded-full py-2.5 px-5 pr-12 outline-none focus:border-indigo-400`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPass(!showConfirmPass)}
                                className="absolute right-4 top-3 text-gray-500"
                            >
                                👁
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-red-500 text-xs ml-2 mt-1">{errors.confirmPassword}</p>
                        )}
                        {errors.match && (
                            <p className="text-red-500 text-xs ml-2 mt-1">{errors.match}</p>
                        )}
                    </div>

                    {/* BUTTON */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-full font-semibold transition-all"
                    >
                        {loading ? "Updating..." : "Update Password"}
                    </button>

                </form>

                {/* BACK */}
                <div className="text-center mt-5">
                    <Link to="/login" className="text-indigo-600 text-xs font-semibold hover:underline">
                        Back to Login
                    </Link>
                </div>

            </div>
        </div>
    );
}

export default ResetPassword;
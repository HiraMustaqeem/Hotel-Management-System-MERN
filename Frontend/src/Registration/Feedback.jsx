import React, { useState, useEffect } from "react";
import API from "../api/axios";

function Feedback() {

    // ==============================
    // FEEDBACKS STATE
    // ==============================

    const [feedbacks, setFeedbacks] = useState([]);

    // ==============================
    // FORM STATE
    // ==============================

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        rating: 5,
        comment: ""
    });

    // ==============================
    // STATES
    // ==============================

    const [loading, setLoading] = useState(true);

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // ==============================
    // FETCH DATA
    // ==============================

    useEffect(() => {

        fetchFeedbacks();

        getCurrentUser();

    }, []);

    // ==============================
    // GET CURRENT LOGGED IN USER
    // ==============================

    const getCurrentUser = async () => {

        try {

            const token = localStorage.getItem("token");

            if (!token) {

                setIsLoggedIn(false);

                return;
            }

            // ==============================
            // MY PROFILE API
            // ==============================

            const response = await API.get(

                "/guest/my-profile",

                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log("PROFILE => ", response.data);

            const user =
                response.data.guest ||
                response.data.user;

            if (user) {

                setIsLoggedIn(true);

                setFormData((prev) => ({
                    ...prev,
                    name: user.name || "",
                    email: user.email || ""
                }));
            }

        } catch (error) {

            console.log(error);

            setIsLoggedIn(false);
        }
    };

    // ==============================
    // FETCH FEEDBACKS
    // ==============================

    const fetchFeedbacks = async () => {

        try {

            setLoading(true);

            const response = await API.get(
                "/feedback/all-feedbacks"
            );

            console.log(response.data);

            setFeedbacks(
                response.data.feedbacks || []
            );

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);
        }
    };

    // ==============================
    // HANDLE CHANGE
    // ==============================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });
    };

    // ==============================
    // STAR CLICK
    // ==============================

    const handleRatingClick = (ratingValue) => {

        setFormData({
            ...formData,
            rating: ratingValue
        });
    };

    // ==============================
    // SUBMIT FEEDBACK
    // ==============================

    const handleSubmit = async (e) => {

        e.preventDefault();

        const token = localStorage.getItem("token");

        if (!token) return;

        if (!formData.comment) {

            alert("Please write your feedback");

            return;
        }

        try {

            const response = await API.post(

                "/feedback/create",

                {
                    feedback: formData.comment,
                    rating: formData.rating
                },

                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log(response.data);

            // ==============================
            // ADD NEW FEEDBACK TOP
            // ==============================

            setFeedbacks([
                response.data.feedback,
                ...feedbacks
            ]);

            // ==============================
            // RESET COMMENT ONLY
            // ==============================

            setFormData((prev) => ({
                ...prev,
                comment: "",
                rating: 5
            }));

        } catch (error) {

            console.log(error);

            alert(
                error?.response?.data?.msg ||
                "Failed to submit feedback"
            );
        }
    };

    return (

        <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">

            {/* HEADER */}

            <div className="text-center mb-12">

                <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight uppercase">

                    Share Your <span className="text-indigo-600">Feedback</span> With Us

                </h1>

                <p className="mt-2 text-sm sm:text-base text-gray-500 font-medium">

                    Your satisfaction is our top priority. Tell us how we did!

                </p>

                <div className="w-16 h-1 bg-indigo-600 mx-auto mt-4 rounded-full"></div>
            </div>

            {/* MAIN GRID */}

            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* LEFT FORM */}

                <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 h-fit">

                    <h2 className="text-xl font-bold text-gray-800 mb-2">

                        Share Your Experience

                    </h2>

                    <p className="text-xs text-gray-400 mb-6">

                        Your honest feedback helps us improve our luxury stay experience.

                    </p>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-4"
                    >

                        {/* NAME */}

                        <div>

                            <label className="block text-xs font-semibold text-gray-400 ml-2 mb-1">

                                Your Name

                            </label>

                            <input
                                type="text"
                                value={formData.name}
                                readOnly
                                placeholder="Login required"
                                className="w-full bg-gray-100 border border-gray-200 outline-none rounded-xl py-2.5 px-4 text-gray-700 text-sm cursor-not-allowed"
                            />
                        </div>

                        {/* EMAIL */}

                        <div>

                            <label className="block text-xs font-semibold text-gray-400 ml-2 mb-1">

                                Email Address

                            </label>

                            <input
                                type="email"
                                value={formData.email}
                                readOnly
                                placeholder="Login required"
                                className="w-full bg-gray-100 border border-gray-200 outline-none rounded-xl py-2.5 px-4 text-gray-700 text-sm cursor-not-allowed"
                            />
                        </div>

                        {/* RATING */}

                        <div>

                            <label className="block text-xs font-semibold text-gray-400 ml-2 mb-1">

                                Rating

                            </label>

                            <div className="flex gap-1.5 mt-1 ml-2">

                                {[1, 2, 3, 4, 5].map((star) => (

                                    <button
                                        type="button"
                                        key={star}
                                        onClick={() => handleRatingClick(star)}
                                        className="focus:outline-none transition-transform active:scale-90"
                                    >

                                        <svg
                                            className={`w-6 h-6 ${
                                                star <= formData.rating
                                                    ? "text-amber-400 fill-amber-400"
                                                    : "text-gray-300"
                                            }`}
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >

                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />

                                        </svg>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* COMMENT */}

                        <div>

                            <label className="block text-xs font-semibold text-gray-400 ml-2 mb-1">

                                Review Description

                            </label>

                            <textarea
                                rows="4"
                                name="comment"
                                value={formData.comment}
                                onChange={handleChange}
                                placeholder="Tell us what you loved or where we can improve..."
                                className="w-full bg-gray-50 border border-gray-200 focus:border-indigo-400 focus:bg-white outline-none rounded-xl py-2.5 px-4 transition-all text-gray-800 text-sm resize-none"
                            />
                        </div>

                        {/* LOGIN MESSAGE */}

                        {
                            !isLoggedIn && (

                                <div className="bg-amber-50 border border-amber-200 text-amber-700 text-xs rounded-xl px-4 py-3 font-medium">

                                    Please login first to submit feedback.

                                </div>
                            )
                        }

                        {/* BUTTON */}

                        <button
                            type="submit"
                            disabled={!isLoggedIn}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed shadow-md shadow-indigo-100 transition-all py-3 rounded-xl text-white font-bold text-sm tracking-wide active:scale-[0.98]"
                        >

                            Submit Feedback

                        </button>
                    </form>
                </div>

                {/* RIGHT SIDE */}

                <div className="flex flex-col">

                    <h2 className="text-xl font-bold text-gray-800 mb-1">

                        What Our Guests Say

                    </h2>

                    <p className="text-xs text-gray-400 mb-6">

                        Real-time reviews fetched directly from visitors

                    </p>

                    <div className="space-y-4 max-h-[550px] overflow-y-auto pr-2 custom-scrollbar">

                        {loading ? (

                            <div className="text-center py-8 text-sm text-gray-400">

                                Loading reviews...

                            </div>

                        ) : feedbacks.length === 0 ? (

                            <div className="text-center py-8 text-sm text-gray-400 bg-white rounded-xl border border-dashed border-gray-200">

                                No reviews yet. Be the first to write one!

                            </div>

                        ) : (

                            feedbacks.map((item, index) => (

                                <div
                                    key={item._id || index}
                                    className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-2"
                                >

                                    <div className="flex justify-between items-center">

                                        <div>

                                            <h4 className="font-bold text-gray-800 text-sm">

                                                {item.guestName}

                                            </h4>

                                            <p className="text-[11px] text-gray-400">

                                                {item.guestEmail}

                                            </p>
                                        </div>

                                        <div className="flex gap-0.5">

                                            {Array.from({ length: 5 }).map((_, i) => (

                                                <svg
                                                    key={i}
                                                    className={`w-3.5 h-3.5 ${
                                                        i < item.rating
                                                            ? "text-amber-400 fill-amber-400"
                                                            : "text-gray-200"
                                                    }`}
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >

                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />

                                                </svg>
                                            ))}
                                        </div>
                                    </div>

                                    <p className="text-xs text-gray-600 leading-relaxed">

                                        {item.feedback}

                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Feedback;
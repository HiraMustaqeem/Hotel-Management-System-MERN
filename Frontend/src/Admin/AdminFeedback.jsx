import React, { useEffect, useState } from "react";
import API from "../api/axios";

const AllFeedbacks = () => {

  // ======================================================
  // STATES
  // ======================================================

  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  // ======================================================
  // FETCH ALL FEEDBACKS
  // ======================================================

  const fetchFeedbacks = async () => {

    try {

      setLoading(true);

      const response = await API.get("/feedback/all");

      setFeedbacks(response.data.feedbacks || []);

    } catch (error) {

      console.log("Fetch Feedback Error:", error?.response?.data);

      alert(
        error?.response?.data?.msg ||
        "Failed to load feedbacks"
      );

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {

    fetchFeedbacks();

  }, []);

  // ======================================================
  // DELETE FEEDBACK
  // ======================================================

  const handleDeleteFeedback = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this feedback?"
    );

    if (!confirmDelete) return;

    try {

      const response = await API.delete(
        `/feedback/delete/${id}`
      );

      setFeedbacks((prev) =>
        prev.filter((item) => item._id !== id)
      );

      alert(response.data.msg);

    } catch (error) {

      console.log("Delete Feedback Error:", error?.response?.data);

      alert(
        error?.response?.data?.msg ||
        "Failed to delete feedback"
      );
    }
  };

  // ======================================================
  // STAR RENDER
  // ======================================================

  const renderStars = (rating) => {

    return Array.from({ length: 5 }).map((_, i) => (

      <svg
        key={i}
        className={`w-4 h-4 ${
          i < rating
            ? "text-amber-400 fill-amber-400"
            : "text-slate-200"
        }`}
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (

    <div className="min-h-screen bg-[#f8fafc] p-6 font-sans text-slate-800">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="max-w-7xl mx-auto mb-8 pb-6 border-b border-slate-200/70 flex flex-col gap-4">

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">

          <div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">

              Guest Feedback{" "}

              <span className="text-transparent bg-clip-text bg-linear-to-r from-[rgb(94,74,247)] to-indigo-600">
                Management
              </span>

            </h1>

            <p className="text-sm text-slate-500 mt-1">
              Monitor and manage all guest reviews submitted through the hotel platform.
            </p>
          </div>

          <div className="px-4 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold shadow-xs">

            Total Feedbacks: {feedbacks.length}

          </div>
        </div>
      </div>

      {/* ======================================================
          CONTENT
      ====================================================== */}

      {loading ? (

        <div className="min-h-screen flex items-center justify-center bg-white">
  <div className="flex flex-col items-center gap-3">
    
    {/* Spinner */}
    <div className="w-10 h-10 border-4 border-slate-200 border-t-[rgb(94,74,247)] rounded-full animate-spin"></div>
  </div>
</div>

      ) : feedbacks.length === 0 ? (

        <div className="max-w-md mx-auto text-center py-16 px-4 bg-white border border-slate-100 rounded-3xl shadow-sm mt-12">

          <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mx-auto mb-4 text-slate-400">

            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.172 9.172a4 4 0 015.656 0M8 13h8m-9 4h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </div>

          <h3 className="text-base font-black text-slate-900">
            No Feedbacks Found
          </h3>

          <p className="text-xs text-slate-500 mt-1">
            Guest reviews will appear here once submitted.
          </p>
        </div>

      ) : (

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

          {feedbacks.map((item) => (

            <div
              key={item._id}
              className="bg-white border border-slate-100 rounded-2xl p-5 shadow-[0_4px_20px_-4px_rgba(148,163,184,0.06)] hover:shadow-[0_10px_30px_-6px_rgba(148,163,184,0.12)] transition-all duration-300 relative group"
            >

              {/* DELETE BUTTON */}

              <button
                onClick={() => handleDeleteFeedback(item._id)}
                className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-100 flex items-center justify-center transition-all duration-200 cursor-pointer group/delete"
                title="Delete Feedback"
              >

                <svg
                  className="w-4 h-4 text-rose-500 group-hover/delete:scale-110 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 7L18.132 19.142A2 2 0 0116.138 21H7.862A2 2 0 015.868 19.142L5 7M10 11V17M14 11V17M4 7H20M15 7V4A1 1 0 0014 3H10A1 1 0 009 4V7"
                  />
                </svg>
              </button>

              {/* USER INFO */}

              <div className="pr-12">

                <h3 className="text-base font-black text-slate-900 tracking-tight">

                  {item.guestName || "Guest User"}

                </h3>

                <p className="text-xs text-slate-400 mt-0.5 break-all">

                  {item.guestEmail || "No email"}

                </p>
              </div>

              {/* RATING */}

              <div className="flex items-center gap-1 mt-4">

                {renderStars(item.rating)}

                <span className="ml-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">

                  {item.rating}/5 Rating

                </span>
              </div>

              {/* FEEDBACK */}

              <div className="mt-4 border-t border-slate-100 pt-4">

                <p className="text-sm text-slate-600 leading-relaxed">

                  {item.feedback}

                </p>
              </div>

              {/* FOOTER */}

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">

                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">

                  ● Public Review

                </span>

                <span className="text-[11px] text-slate-400 font-medium">

                  Guest Feedback

                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllFeedbacks;
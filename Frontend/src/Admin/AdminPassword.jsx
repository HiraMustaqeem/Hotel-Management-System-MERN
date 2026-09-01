import React, { useState } from 'react';
import API from "../api/axios";

const AdminPassword = () => {

  const [isUpdating, setIsUpdating] = useState(false);

  const [statusMessage, setStatusMessage] = useState({
    type: '',
    text: ''
  });

  // ==============================
  // PASSWORD STATES
  // ==============================

  const [passwords, setPasswords] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // ==============================
  // PASSWORD VISIBILITY
  // ==============================

  const [showOld, setShowOld] = useState(false);

  const [showNew, setShowNew] = useState(false);

  const [showConfirm, setShowConfirm] = useState(false);

  // ==============================
  // SIMPLE VALIDATION (6+ chars)
  // ==============================

  const isValidPassword =
    passwords.newPassword.length >= 6;

  // ==============================
  // SUBMIT HANDLER
  // ==============================

 const handlePasswordSubmit = async (e) => {
  e.preventDefault();

  setStatusMessage({
    type: '',
    text: ''
  });

  // REQUIRED FIELDS
  if (
    !passwords.oldPassword ||
    !passwords.newPassword ||
    !passwords.confirmPassword
  ) {
    setStatusMessage({
      type: 'error',
      text: 'All fields are required.'
    });
    return;
  }

  // 6+ CHAR VALIDATION
  if (!isValidPassword) {
    setStatusMessage({
      type: 'error',
      text: 'New password must contain at least 6 characters.'
    });
    return;
  }

  // MATCH VALIDATION
  if (passwords.newPassword !== passwords.confirmPassword) {
    setStatusMessage({
      type: 'error',
      text: 'Confirm password does not match.'
    });
    return;
  }

  try {
    setIsUpdating(true);

    const token = localStorage.getItem("token");

    const response = await API.patch(
      "/auth/change-password",   // ✅ FIXED ROUTE (IMPORTANT)
      {
        oldPassword: passwords.oldPassword,
        newPassword: passwords.newPassword
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    setStatusMessage({
      type: 'success',
      text: response.data.msg
    });

    // RESET FORM
    setPasswords({
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    });

  } catch (error) {
    console.log(error);

    setStatusMessage({
      type: 'error',
      text:
        error?.response?.data?.msg ||
        "Failed to change password"
    });

  } finally {
    setIsUpdating(false);
  }
};

  return (

    <div className="bg-[#f8fafc] min-h-screen p-6 font-sans text-slate-800 antialiased flex items-center justify-center">

      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(148,163,184,0.04)] overflow-hidden">

        {/* HEADER */}

        <div className="p-6 border-b border-slate-50 bg-slate-50/50">

          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[rgb(94,74,247)] mb-3">

            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>

          </div>

          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Change Password
          </h2>

          <p className="text-xs text-slate-400 mt-0.5">
            Update your admin dashboard password securely.
          </p>

        </div>

        {/* FORM */}

        <form
          onSubmit={handlePasswordSubmit}
          className="p-6 space-y-4"
        >

          {/* OLD PASSWORD */}

          <div>

            <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1.5">
              Current Password
            </label>

            <div className="relative">

              <input
                type={showOld ? 'text' : 'password'}
                placeholder="••••••••"
                value={passwords.oldPassword}
                onChange={(e) =>
                  setPasswords({
                    ...passwords,
                    oldPassword: e.target.value
                  })
                }
                className="w-full pl-3.5 pr-10 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-[rgb(94,74,247)] transition-all text-slate-700"
              />

              <button
                type="button"
                onClick={() => setShowOld(!showOld)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >

                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d={showOld
                      ? "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M3 3l18 18"
                      : "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"}
                  />
                </svg>

              </button>

            </div>

          </div>

          {/* NEW PASSWORD */}

          <div>

            <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1.5">
              New Password
            </label>

            <div className="relative">

              <input
                type={showNew ? 'text' : 'password'}
                placeholder="••••••••"
                value={passwords.newPassword}
                onChange={(e) =>
                  setPasswords({
                    ...passwords,
                    newPassword: e.target.value
                  })
                }
                className="w-full pl-3.5 pr-10 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-[rgb(94,74,247)] transition-all text-slate-700"
              />

              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >

                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d={showNew
                      ? "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M3 3l18 18"
                      : "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"}
                  />
                </svg>

              </button>

            </div>

            {/* VALIDATION */}

            {passwords.newPassword && (

              <div className="mt-3 bg-slate-50 border border-slate-100 rounded-xl p-3">

                <div className="flex items-center gap-2">

                  <div
                    className={`w-2 h-2 rounded-full ${
                      isValidPassword
                        ? 'bg-emerald-500'
                        : 'bg-slate-300'
                    }`}
                  ></div>

                  <span
                    className={`text-[11px] font-semibold ${
                      isValidPassword
                        ? 'text-slate-700'
                        : 'text-slate-400'
                    }`}
                  >
                    Minimum 6 characters required
                  </span>

                </div>

              </div>
            )}

          </div>

          {/* CONFIRM PASSWORD */}

          <div>

            <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1.5">
              Confirm Password
            </label>

            <div className="relative">

              <input
                type={showConfirm ? 'text' : 'password'}
                placeholder="••••••••"
                value={passwords.confirmPassword}
                onChange={(e) =>
                  setPasswords({
                    ...passwords,
                    confirmPassword: e.target.value
                  })
                }
                className="w-full pl-3.5 pr-10 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-[rgb(94,74,247)] transition-all text-slate-700"
              />

              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >

                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d={showConfirm
                      ? "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M3 3l18 18"
                      : "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"}
                  />
                </svg>

              </button>

            </div>

          </div>

          {/* MESSAGE */}

          {statusMessage.text && (

            <div
              className={`p-3 rounded-xl border text-xs font-bold ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                  : 'bg-rose-50 border-rose-100 text-rose-700'
              }`}
            >
              {statusMessage.text}
            </div>
          )}

          {/* SUBMIT BUTTON */}

          <button
            type="submit"
            disabled={isUpdating}
            className="w-full mt-2 py-3 bg-[rgb(94,74,247)] hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
          >

            {isUpdating ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Updating Password...
              </>
            ) : (
              'Change Password'
            )}

          </button>

        </form>

      </div>
    </div>
  );
};

export default AdminPassword;
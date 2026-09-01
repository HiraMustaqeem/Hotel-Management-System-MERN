import React, { useState, useEffect } from "react";
import {
  Link,
  useNavigate,
  useLocation
} from "react-router-dom";

import {
  LogOut,
  User
} from "lucide-react";


function Navbar() {
const [isOpen, setIsOpen] = useState(false);
const [isLoggedIn, setIsLoggedIn] = useState(false);

const navigate = useNavigate();
const location = useLocation();

  // check token on mount
  useEffect(() => {

  const token = localStorage.getItem("token");

  setIsLoggedIn(!!token);

}, [location.pathname]);

  // logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <header className="flex items-center justify-between px-6 py-3 md:py-4 shadow-sm max-w-5xl rounded-full mx-auto w-full bg-white relative z-50">

      <Link to="/" className="text-xl font-bold text-indigo-600 italic">
        Luxury Stay
      </Link>

      {/* NAV */}
      <nav className="hidden md:flex gap-6 text-sm">
        <Link to="/">Home</Link>
        <Link to="/aboutus">About</Link>
        <Link to="/contactus">Contact</Link>
        <Link to="/rooms">Rooms</Link>
      </nav>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-3">

        {/* NOT LOGGED IN */}
        {!isLoggedIn && (
          <>
            <Link
              to="/login"
              className="bg-indigo-600 text-white px-5 py-2 rounded-full text-sm"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="bg-indigo-600 text-white px-5 py-2 rounded-full text-sm"
            >
              Register
            </Link>

            
          </>
        )}

        {/* LOGGED IN */}
        {isLoggedIn && (
          <>
            <Link
              to="/profile"
              className="bg-indigo-600 text-white w-10 h-10 rounded-full flex items-center justify-center"
            >
              <User size={18} />
            </Link>

            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-5 py-2 rounded-full text-sm flex items-center gap-2"
            >
              <LogOut size={16} />
              Logout
            </button>
          </>
        )}

      </div>
    </header>
  );
}

export default Navbar;




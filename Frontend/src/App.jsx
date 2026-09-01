import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

// COMPONENTS
import Navbar from "./Components/Navbar";
import Hero from "./Components/Hero";
import About from "./Components/About";
import Services from "./Components/Services";
import RoomMarque from "./Components/RoomMarque";
import Policies from "./Components/Policies";
import Review from "./Components/Review";
import Faq from "./Components/Faq";
import Contact from "./Components/Contact";
import Newsletter from "./Components/Newsletter";
import TopBanner from "./Components/TopBanner";
import Atmcard from "./Components/Atmcard";
import Footer from "./Components/Footer";

// PAGES
import Aboutus from "./Pages/Aboutus";
import Reviews from "./Pages/Reviews";
import Rooms from "./Pages/Rooms";
import Login from "./Registration/Login";
import Register from "./Registration/Register";
import Booknow from "./Registration/Booknow";
import Feedback from "./Registration/Feedback";
import Contactus from "./Pages/Contactus";
import Forgotpassword from "./Registration/Forgotpassword";
import ResetPassword from "./Registration/ResetPassword";
import SetPassword from "./Registration/setPassword";
import Profile from "./Registration/Profile";
import Logout from "./Registration/Logout";

// MANAGEMENT PANELS IMPORTS
import AdminLayout from "./Admin/AdminLayout";
import ManagementLogin from "./Registration/ManagementLogin";
import ReceptionistLayout from "./Receptionist/ReceptionistLayout"; 
import ManagerLayout from "./Manager/ManagerLayout"; 
import HousekeepingLayout from "./Housekeeping/HousekeepingLayout";


function Layout() {
  const location = useLocation();

  // Admin routes check
  const hideLayout =
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/managementLogin") ||
    location.pathname.startsWith("/receptionist") ||
    location.pathname.startsWith("/manager") ||
    location.pathname.startsWith("/housekeeping") 

  return (
    <>
      {!hideLayout && (
        <>
          <div className="mb-2">
            <TopBanner />
          </div>

          <Navbar />
        </>
      )}

      <Routes>
        <Route
          path="/"
          element={
            <>
              <Hero />
              <About />
              <Services />
              {/* <RoomMarque /> */}
              <Policies />
              {/* <Review /> */}
              <Faq />
              <Feedback />
              {/* <Atmcard /> */}
              <Newsletter />
              <Contact />
            </>
          }
        />

        <Route path="/contactus" element={<Contactus />} />
        <Route path="/aboutus" element={<Aboutus />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/book-now/:id" element={<Booknow />} />
        <Route path="/forgot-password" element={<Forgotpassword />} />
        <Route path="/guest-reset-password/:token" element={<ResetPassword />} />
        <Route path="/set-password/:token" element={<SetPassword />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/feedback" element={<Feedback />} />

        {/* Management Routes */}
        <Route path="/admin/*" element={<AdminLayout />} />
        <Route path="/managementLogin/*" element={<ManagementLogin />} />
        <Route path="/manager" element={<ManagerLayout />} />
        <Route path="/receptionist/*" element={<ReceptionistLayout />} />
        <Route path="/housekeeping" element={<HousekeepingLayout />} />
      </Routes>

      {!hideLayout && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
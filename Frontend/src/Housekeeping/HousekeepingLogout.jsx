// import { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

// const HousekeepingLogout = () => {
//   const navigate = useNavigate();

//   useEffect(() => {
//     // 1. Session clear karein (Agar aap localStorage use kar rahi hain)
//     localStorage.removeItem("userToken");
//     localStorage.removeItem("userRole");

//     // 2. 1 second ka delay dein taake user ko pata chale wo logout ho raha hai
//     const timer = setTimeout(() => {
//       navigate('/');
//       window.location.reload(); // Page refresh taake nav/footer wapis aa jayein
//     }, 1000);

//     return () => clearTimeout(timer);
//   }, [navigate]);

//   return (
//     <div className="flex flex-col items-center justify-center h-screen">
//       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
//       <p className="text-lg font-semibold text-slate-700">Logging out...</p>
//     </div>
//   );
// };

// export default HousekeepingLogout;
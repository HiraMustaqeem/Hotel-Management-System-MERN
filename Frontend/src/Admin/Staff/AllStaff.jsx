import React, { useState, useEffect } from "react";
import API from "../../api/axios";

const AllStaff = () => {
const [staffList, setStaffList] = useState([]);
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('All');
  
  // Edit Form Modal States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);


  const fetchStaff = async () => {
  try {
    const response = await API.get("/admin/all-staff");

setStaffList(
  response.data.staff.map((s) => ({
    ...s,
    profileImage: s.profileImage || null,
    role: s.role || "unknown",
  }))
);
 } catch (error) {
    console.log("Fetch Staff Error:", error?.response?.data);
    alert(error?.response?.data?.msg || "Failed to load staff");
  }
};

useEffect(() => {
  fetchStaff();
}, []);
const handleToggleActive = async (id) => {
  try {
    const res = await API.patch(`/admin/toggle-status/${id}`);

    const updatedStaff = {
  ...res.data.staff,
  role: res.data.staff.role || "unknown",
};

setStaffList(prev =>
  prev.map(item =>
    item._id === id
      ? { ...item, isActive: res.data.staff.isActive }
      : item
  )
);

  } catch (error) {
    console.log("Toggle Error:", error?.response?.data);
    alert(error?.response?.data?.msg || "Status update failed");
  }
};

  const handleOpenEditModal = (staffMember) => {
    setEditingStaff({ ...staffMember }); 
    setIsEditModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingStaff(prev => ({ ...prev, [name]: value }));
  };

 const handleSaveChanges = async (e) => {
  e.preventDefault();

  try {
    const payload = {
      name: editingStaff.name,
      email: editingStaff.email,
      role: editingStaff.role.toLowerCase() 
    };

    const res = await API.patch(
      `/admin/update-staff/${editingStaff._id}`,
      payload
    );

    setStaffList(prev =>
      prev.map(item =>
        item._id === editingStaff._id
          ? { ...item, ...res.data.staff }
          : item
      )
    );

    setIsEditModalOpen(false);
    setEditingStaff(null);

    alert(res.data.msg);

  } catch (error) {
    console.log("Update Error:", error?.response?.data);
    alert(error?.response?.data?.msg || "Update failed");
  }
};

  const filteredStaff = staffList.filter(staff => {
    if (selectedRoleFilter === 'All') return true;
return staff.role?.toLowerCase() === selectedRoleFilter.toLowerCase();
  });
const DEFAULT_AVATAR =
  "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg";

const getStaffImage = (img) => {
  if (!img) return DEFAULT_AVATAR;
  return img; 
};
  return (
    <div className="bg-[#f8fafc] min-h-screen p-6 font-sans text-slate-800 antialiased relative">
      
      {/* Header Container Layout */}
      <div className="max-w-7xl mx-auto mb-8 pb-6 border-b border-slate-200/60 flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight sm:text-3xl">
              Staff Directory <span className="text-transparent bg-clip-text bg-linear-to-r from-[rgb(94,74,247)] to-indigo-600">Management</span>
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Monitor internal employee statuses, control application operational privileges, and filter role groups.
            </p>
          </div>
          <div className="px-4 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold shadow-xs">
            Total Staff: {staffList.length}
          </div>
        </div>

        {/* 🔍 FILTER DROPDOWN: Positioned directly under paragraph */}
        <div className="flex items-center gap-3 w-full max-w-xs">
          <div className="relative flex-1">
            <select
              value={selectedRoleFilter}
              onChange={(e) => setSelectedRoleFilter(e.target.value)}
              className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-slate-200 text-xs font-bold bg-white text-slate-700 shadow-sm focus:outline-hidden focus:border-[rgb(94,74,247)] focus:ring-4 focus:ring-[rgb(94,74,247)]/10 transition-all appearance-none cursor-pointer"
            >
              <option value="All">All Staff Directory</option>
              <option value="manager">Managers Only</option>
              <option value="receptionist">Receptionists Only</option>
              <option value="housekeeping">House Keeping Crew</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-400">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Dashboard Renderer Block */}
      {filteredStaff.length > 0 ? (
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredStaff.map((staff) => (
            <div 
              key={staff._id} 
              className={`rounded-2xl border p-5 flex flex-col justify-between relative group transition-all duration-300 ${
                staff.isActive 
                  ? 'bg-white border-slate-100 shadow-[0_4px_20px_-4px_rgba(148,163,184,0.06)] hover:shadow-[0_10px_30px_-6px_rgba(148,163,184,0.12)]' 
                  : 'bg-slate-100/70 border-slate-200/60 shadow-none animate-pulse-none' 
                  
              }`
            }
            >
              
              {/* Toggle Trigger Switch */}
              <div className="absolute top-5 right-5 z-20 flex flex-col items-end gap-1">
                <button
                  onClick={() => handleToggleActive(staff._id)}
                  className="relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden"
                  style={{ backgroundColor: staff.isActive ? 'rgb(34, 197, 94)' : 'rgb(203, 213, 225)' }}
                  role="switch"
                  aria-checked={staff.isActive}
                >
                  <span
                    className="inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out"
                    style={{ transform: staff.isActive ? 'translateX(20px)' : 'translateX(0px)' }}
                  />
                </button>
                <span className={`text-[9px] font-black uppercase tracking-wider select-none ${staff.isActive ? 'text-emerald-600' : 'text-slate-400'}`}>
                  {staff.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              {/* ❄️ FROZEN SYSTEM CONTAINER LAYOUT BLOCK */}
              <div className={`flex flex-col flex-1 justify-between ${!staff.isActive ? 'pointer-events-none select-none opacity-50' : ''}`}>
                <div>
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-xl bg-slate-50 overflow-hidden border border-slate-100 shadow-xs shrink-0">
<img
  src={getStaffImage(staff.profileImage)}
  alt={staff.name || "staff"}
  className="w-full h-full object-cover"
  onError={(e) => {
    e.currentTarget.src = DEFAULT_AVATAR;
  }}
/>       </div>
                  </div>

                  {/* Identification Badges */}
                  <div className="mt-4 space-y-1">
                    <h3 className="text-base font-black text-slate-900 tracking-tight truncate pr-12">
                      {staff.name}
                    </h3>
                 <span
  className={`inline-block text-[10px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded-md ${
    staff.role?.toLowerCase() === "manager"
      ? "bg-indigo-50 text-indigo-600 border border-indigo-100"
      : staff.role?.toLowerCase() === "receptionist"
      ? "bg-sky-50 text-sky-600 border border-sky-100"
      : staff.role?.toLowerCase() === "housekeeping"
      ? "bg-amber-50 text-amber-600 border border-amber-100"
      : "bg-slate-100 text-slate-600 border border-slate-200"
  }`}
>
  {staff.role?.charAt(0).toUpperCase() + staff.role?.slice(1)}
</span>
                  </div>

                  {/* Clean SVG Vector Metadata Lines */}
                  <div className="mt-5 space-y-2.5 text-xs text-slate-500 font-medium border-t border-slate-100 pt-4">
                    <div className="flex items-center gap-2.5">
                      <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="truncate text-slate-600 font-semibold">{staff.email}</span>
                    </div>
                    
                    <div className="flex items-center gap-2.5">
                      <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span className="text-slate-600 font-semibold">{staff.contactNumber || "Not set yet"}</span>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <svg className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13 21a1 1 0 01-1.414 0l-4.657-4.657a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="line-clamp-2 leading-normal text-slate-600 font-semibold">{staff.address  || "Not set yet"}</span>
                    </div>
                  </div>
                </div>

                {/* Update Action Button */}
                <div className="mt-5 pt-3 border-t border-slate-100">
                  <button 
                    onClick={() => handleOpenEditModal(staff)}
                    className="w-full py-2.5 text-center text-xs font-bold text-white bg-[rgb(94,74,247)] hover:bg-indigo-600 rounded-xl transition-colors cursor-pointer shadow-xs shadow-indigo-100"
                  >
                    Update Profile
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      ) : (
        /* Empty Fallback state */
        <div className="max-w-md mx-auto text-center py-16 px-4 bg-white border border-slate-100 rounded-3xl shadow-sm mt-12">
          <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mx-auto mb-4 text-slate-400">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-base font-black text-slate-900">No Members Found</h3>
          <p className="text-xs text-slate-500 mt-1">
            There are no registry listings matching this filter criteria at the moment.
          </p>
        </div>
      )}

      {/* =========================================================================
          🎨 REALTIME INTERACTIVE EDIT MODAL COMPONENT (Address Field Removed)
         ========================================================================= */}
      {isEditModalOpen && editingStaff && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 transition-all overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-slate-100 transform scale-100 transition-transform my-8">
            
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Edit Profile Configuration</h2>
                <p className="text-[11px] text-slate-400">Modifying profile and image data layers</p>
              </div>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSaveChanges} className="mt-4 space-y-4">
              
           
              {/* Full Name Input */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Full Name</label>
               <input
  type="text"
  name="name"
  value={editingStaff.name}
  disabled
  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-100 cursor-not-allowed font-semibold"
/>
              </div>

              {/* Role Dropdown Selection */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Organizational Role</label>
                <select 
                  name="role" 
                  value={editingStaff.role} 
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:border-[rgb(94,74,247)] focus:ring-4 focus:ring-[rgb(94,74,247)]/10 transition-all font-semibold text-slate-700 bg-white"
                >
                  <option value="manager">Manager</option>
                  <option value="receptionist">Receptionist</option>
                  <option value="housekeeping">Housekeeping</option>
                </select>
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email Address</label>
                <input 
                  type="email" 
                  name="email" 
                  value={editingStaff.email} 
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:border-[rgb(94,74,247)] focus:ring-4 focus:ring-[rgb(94,74,247)]/10 transition-all font-semibold"
                />
              </div>


              {/* Action Sheet buttons footer */}
              <div className="flex gap-3 pt-2 border-t border-slate-100 mt-6">
                <button 
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 py-2.5 text-xs font-bold text-slate-500 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-2.5 text-xs font-bold text-white bg-[rgb(94,74,247)] hover:bg-indigo-600 rounded-xl transition-colors cursor-pointer shadow-xs shadow-indigo-100"
                >
                  Save Changes
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default AllStaff;
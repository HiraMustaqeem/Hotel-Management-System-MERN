import React, { useEffect, useState } from "react";
import API from "../../api/axios";

const AllServices = () => {

  const [services, setServices] = useState([]);

  // modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const [loading, setLoading] = useState(false);

  // =========================================
  // FETCH ALL SERVICES
  // =========================================
  const fetchServices = async () => {

    try {

      const res = await API.get("/service/all");

      setServices(res.data.services);

    } catch (error) {

      console.log("Fetch Services Error:", error?.response?.data);

      alert(
        error?.response?.data?.msg || "Failed to fetch services"
      );
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // =========================================
  // OPEN MODAL
  // =========================================
  const handleCardClick = (service) => {

    setEditingService({
      ...service,
      price: service.price || ""
    });

    setIsModalOpen(true);
  };

  // =========================================
  // HANDLE INPUT CHANGE
  // =========================================
  const handleInputChange = (e) => {

    const { name, value } = e.target;

    setEditingService((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // =========================================
  // UPDATE SERVICE
  // =========================================
  const handleUpdate = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      const payload = {
        name: editingService.name,
        price: Number(editingService.price),
        description: editingService.description
      };

      const res = await API.patch(
        `/service/update/${editingService._id}`,
        payload
      );

      setServices((prev) =>
        prev.map((service) =>
          service._id === editingService._id
            ? res.data.service
            : service
        )
      );

      alert(res.data.msg);

      setIsModalOpen(false);
      setEditingService(null);

    } catch (error) {

      console.log("Update Service Error:", error?.response?.data);

      alert(
        error?.response?.data?.msg || "Failed to update service"
      );

    } finally {

      setLoading(false);
    }
  };

  // =========================================
  // DELETE SERVICE
  // =========================================
  const handleRemove = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this service?"
    );

    if (!confirmDelete) return;

    try {

      const res = await API.delete(
        `/service/delete/${id}`
      );

      setServices((prev) =>
        prev.filter((service) => service._id !== id)
      );

      alert(res.data.msg);

      setIsModalOpen(false);

    } catch (error) {

      console.log("Delete Service Error:", error?.response?.data);

      alert(
        error?.response?.data?.msg || "Failed to delete service"
      );
    }
  };

  return (
    <div className="min-h-screen bg-white p-6 text-slate-800 font-sans">

      {/* HEADER */}

      <div className="mb-8 max-w-6xl mx-auto">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight sm:text-3xl">
              All Additional <span className="text-transparent bg-clip-text bg-linear-to-r from-[rgb(94,74,247)] to-indigo-600">Services</span>
            </h1>
            <p className="text-sm text-slate-500 mt-1">
          Click on any card to update service details or remove services.
            </p>
          </div>
      

      {/* SERVICES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">

        {services.map((service) => (

          <div
            key={service._id}
            onClick={() => handleCardClick(service)}
            className="group bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[rgb(94,74,247)]/50 cursor-pointer flex flex-col justify-between relative"
          >

            {/* DELETE ICON */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRemove(service._id);
              }}
              className="absolute top-4 right-4 p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-500 transition-all duration-200"
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
                  d="M19 7L5 7M10 11V17M14 11V17M6 7L7 19C7.1 20.1 7.9 21 9 21H15C16.1 21 16.9 20.1 17 19L18 7M9 7V4C9 3.4 9.4 3 10 3H14C14.6 3 15 3.4 15 4V7"
                />
              </svg>
            </button>

            <div>

              {/* SERVICE NAME */}
              <h3 className="font-bold text-base text-slate-900 group-hover:text-[rgb(94,74,247)] transition-colors duration-200 pr-10">
                {service.name}
              </h3>

              {/* PRICE */}
              <div className="text-lg font-black text-[rgb(94,74,247)] mt-3 mb-3">
                ${service.price}
              </div>

              {/* DESCRIPTION */}
              <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                {service.description || "No description added yet"}
              </p>
            </div>

            {/* FOOTER */}
            <div className="mt-5 pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] font-semibold tracking-wider uppercase">

              <span className="text-emerald-600">
                ● Available Service
              </span>

              <span className="text-slate-400 group-hover:text-slate-600 transition-colors duration-200">
                Click to Edit →
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* =========================================
          EDIT MODAL
      ========================================= */}
      {isModalOpen && editingService && (

        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">

          <div
            className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl p-7 shadow-xl relative"
            onClick={(e) => e.stopPropagation()}
          >

            {/* CLOSE BUTTON */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* TITLE */}
            <div className="mb-6">

              <h3 className="text-lg font-bold text-slate-900">
                Manage Service
              </h3>

              <p className="text-xs text-slate-500 mt-0.5">
                Update service information.
              </p>
            </div>

            {/* FORM */}
            <form onSubmit={handleUpdate} className="space-y-5">

              {/* NAME */}
              <div className="space-y-1.5">

                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  Service Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={editingService.name}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[rgb(94,74,247)] focus:ring-1 focus:ring-[rgb(94,74,247)]"
                />
              </div>

              {/* PRICE */}
              <div className="space-y-1.5">

                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  Price ($)
                </label>

                <input
                  type="number"
                  name="price"
                  value={editingService.price}
                  onChange={handleInputChange}
                  step="0.01"
                  required
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[rgb(94,74,247)] focus:ring-1 focus:ring-[rgb(94,74,247)]"
                />
              </div>

              {/* DESCRIPTION */}
              <div className="space-y-1.5">

                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  Description
                </label>

                <textarea
                  name="description"
                  value={editingService.description}
                  onChange={handleInputChange}
                  rows="3"
                  required
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[rgb(94,74,247)] focus:ring-1 focus:ring-[rgb(94,74,247)] resize-none"
                />
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex items-center gap-3 pt-2">

                {/* CANCEL */}
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="ml-auto px-4 py-2.5 rounded-xl border border-slate-200 text-slate-500 text-xs font-semibold hover:text-slate-700 hover:bg-slate-100 transition-all duration-150"
                >
                  Cancel
                </button>

                {/* UPDATE */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-5 py-2.5 rounded-xl text-xs font-semibold text-white shadow-sm transition-all duration-150 active:scale-95
                  
                  ${
                    loading
                      ? "bg-slate-400 cursor-not-allowed"
                      : "bg-[rgb(94,74,247)] hover:bg-indigo-600"
                  }`}
                >
                  {loading ? "Updating..." : "Update Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllServices;
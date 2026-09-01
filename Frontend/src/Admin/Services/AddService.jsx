import React, { useState } from "react";
import API from "../../api/axios";

const AddService = () => {

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: ""
  });

  const [loading, setLoading] = useState(false);

  // ==============================
  // HANDLE INPUT CHANGE
  // ==============================
  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // ==============================
  // HANDLE SUBMIT
  // ==============================
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      const payload = {
        name: formData.name.trim(),
        price: Number(formData.price),
        description: formData.description.trim()
      };

      const res = await API.post(
        "/service/create",
        payload
      );

      alert(res.data.msg);

      // reset form
      setFormData({
        name: "",
        price: "",
        description: ""
      });

    } catch (error) {

      console.log("Create Service Error:", error?.response?.data);

      alert(
        error?.response?.data?.msg || "Failed to create service"
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="min-h-screen bg-white p-6 flex flex-col items-center justify-start text-slate-800 font-sans">

      {/* Form Container */}
      <div className="w-full max-w-xl bg-slate-50 border border-slate-200 rounded-2xl p-8 shadow-sm mt-10">

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 tracking-wide">
            Add New Service
          </h2>

          <p className="text-xs text-slate-500 mt-1">
            Create a new premium service or amenity for your luxury stay.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Service Name */}
          <div className="space-y-2">

            <label className="text-xs font-semibold text-slate-600 tracking-wider uppercase">
              Service Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Breakfast, Airport Transport"
              required
              className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[rgb(94,74,247)] focus:ring-1 focus:ring-[rgb(94,74,247)] transition-all duration-200"
            />
          </div>

          {/* Price */}
          <div className="space-y-2">

            <label className="text-xs font-semibold text-slate-600 tracking-wider uppercase">
              Price
            </label>

            <div className="relative">

              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm">
                $
              </span>

              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                min="0"
                step="0.01"
                required
                className="w-full bg-white border border-slate-300 rounded-xl pl-8 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[rgb(94,74,247)] focus:ring-1 focus:ring-[rgb(94,74,247)] transition-all duration-200"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">

            <label className="text-xs font-semibold text-slate-600 tracking-wider uppercase">
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the service details..."
              rows="4"
              required
              className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[rgb(94,74,247)] focus:ring-1 focus:ring-[rgb(94,74,247)] transition-all duration-200 resize-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 px-4 rounded-xl text-sm font-semibold text-white tracking-wide shadow-md transition-all duration-200 active:scale-[0.99]
              
              ${loading
                ? "bg-slate-400 cursor-not-allowed"
                : "bg-[rgb(94,74,247)] hover:bg-indigo-600 shadow-[rgba(94,74,247,0.15)] cursor-pointer"
              }
            `}
          >
            {loading ? "Adding Service..." : "Add Service"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default AddService;
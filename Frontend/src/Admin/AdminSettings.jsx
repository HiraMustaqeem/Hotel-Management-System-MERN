import React, { useState, useEffect } from 'react';
import API from "../api/axios";

const AdminSettings = () => {


  // Navigation tabs state
  const [activeTab, setActiveTab] = useState('general'); // general, pricing, api
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [generalSettings, setGeneralSettings] = useState({
    propertyTitle: "",
    officialSupportEmail: "",
    helpDeskContact: "",
    defaultCheckinTime: "",
    defaultCheckoutTime: "",
    maintenanceMode: false
  });

  const [pricingSettings, setPricingSettings] = useState({
    taxPercentage: "",
    cancellationPolicy: "",
    refundPolicy: ""
  });


  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/settings", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = res.data.settings;

      if (!data) return;

      // ✅ GENERAL (FIXED KEYS)
      setGeneralSettings({
        propertyTitle: data.propertyTitle || "",
        officialSupportEmail: data.officialSupportEmail || "",
        helpDeskContact: data.helpDeskContact || "",
        defaultCheckinTime: data.defaultCheckinTime || "",
        defaultCheckoutTime: data.defaultCheckoutTime || "",
        maintenanceMode: data.maintenanceMode || false
      });

      // ✅ PRICING (already correct)
      setPricingSettings({
        taxPercentage: data.taxPercentage || "",
        cancellationPolicy: data.cancellationPolicy || "",
        refundPolicy: data.refundPolicy || ""
      });

    } catch (err) {
      console.log(err);
    }
  };


  // Universal Save Loader Function
  const handleSave = async (e) => {
    e.preventDefault();

    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const token = localStorage.getItem("token");

      const payload = {
        ...generalSettings,
        ...pricingSettings
      };

      await API.patch("/settings/update", payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setSaveSuccess(true);

      setTimeout(() => setSaveSuccess(false), 3000);

    } catch (err) {
      console.log(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen p-6 font-sans text-slate-800 antialiased">

      {/* Header Section */}
      <div className="max-w-4xl mx-auto mb-6">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight sm:text-3xl">
          System <span className="text-transparent bg-clip-text bg-linear-to-r from-[rgb(94,74,247)] to-indigo-600">Settings</span>
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Configure core parameters, control global tax ratios, manage API integrations, and manage system states.
        </p>
      </div>

      <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(148,163,184,0.05)] overflow-hidden">

        {/* Tab Navigation Headers with SVGs */}
        <div className="flex border-b border-slate-100 bg-slate-50/60 p-2 gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('general')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${activeTab === 'general'
              ? 'bg-white text-[rgb(94,74,247)] shadow-sm border border-slate-100'
              : 'text-slate-500 hover:bg-white/60 hover:text-slate-800'
              }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            General Rules
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('pricing')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${activeTab === 'pricing'
              ? 'bg-white text-[rgb(94,74,247)] shadow-sm border border-slate-100'
              : 'text-slate-500 hover:bg-white/60 hover:text-slate-800'
              }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Pricing & Taxes
          </button>


        </div>

        {/* Core Form Area */}
        <form onSubmit={handleSave} className="p-6 sm:p-8 space-y-6">

          {/* TAB 1: GENERAL SETTINGS */}
          {activeTab === 'general' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-400 tracking-wider mb-1.5">Property / Organization Title</label>
                  <input
                    type="text"
                    value={generalSettings.propertyTitle}
                    onChange={(e) =>
                      setGeneralSettings({
                        ...generalSettings,
                        propertyTitle: e.target.value
                      })
                    } className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-[rgb(94,74,247)] transition-all font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-400 tracking-wider mb-1.5">Official Support Email</label>
                  <input
                    type="email"
                    value={generalSettings.officialSupportEmail}
                    onChange={(e) =>
                      setGeneralSettings({
                        ...generalSettings,
                        officialSupportEmail: e.target.value
                      })
                    }
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-[rgb(94,74,247)] transition-all font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-400 tracking-wider mb-1.5">Help-desk Contact</label>
                  <input
                    type="text"
                    value={generalSettings.helpDeskContact}
                    onChange={(e) =>
                      setGeneralSettings({
                        ...generalSettings,
                        helpDeskContact: e.target.value
                      })
                    } className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-[rgb(94,74,247)] transition-all font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-400 tracking-wider mb-1.5">Default Check-In Time</label>
                  <input
                    type="text"
                    value={generalSettings.defaultCheckinTime}
                    onChange={(e) =>
                      setGeneralSettings({
                        ...generalSettings,
                        defaultCheckinTime: e.target.value
                      })
                    } className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-[rgb(94,74,247)] transition-all font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-400 tracking-wider mb-1.5">Default Check-Out Time</label>
                  <input
                    type="text"
                    value={generalSettings.defaultCheckoutTime}
                    onChange={(e) =>
                      setGeneralSettings({
                        ...generalSettings,
                        defaultCheckoutTime: e.target.value
                      })
                    } className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-[rgb(94,74,247)] transition-all font-medium"
                  />
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: PRICING & TAXES */}
          {activeTab === 'pricing' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-400 tracking-wider mb-1.5">Global Tax Ratio (%)</label>
                  <input
                    type="number"
                    value={pricingSettings.taxPercentage}
                    onChange={(e) => setPricingSettings({ ...pricingSettings, taxPercentage: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 font-mono font-bold focus:outline-hidden focus:border-[rgb(94,74,247)]"
                  />
                </div>

              </div>

              {/* INJECTED POLICY ARCHITECTURE CONFIGURATIONS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-400 tracking-wider mb-1.5">Cancellation Policy Rules</label>
                  <textarea
                    rows="3"
                    value={pricingSettings.cancellationPolicy}
                    onChange={(e) => setPricingSettings({ ...pricingSettings, cancellationPolicy: e.target.value })}
                    placeholder="Enter structural guidelines for slot cancellations..."
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 font-medium text-slate-600 focus:outline-hidden focus:border-[rgb(94,74,247)] resize-none"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-400 tracking-wider mb-1.5">Refund Processing Policy</label>
                  <textarea
                    rows="3"
                    value={pricingSettings.refundPolicy}
                    onChange={(e) => setPricingSettings({ ...pricingSettings, refundPolicy: e.target.value })}
                    placeholder="Enter automated gateway refund timeline parameters..."
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 font-medium text-slate-600 focus:outline-hidden focus:border-[rgb(94,74,247)] resize-none"
                  ></textarea>
                </div>
              </div>


            </div>
          )}


          {/* Action Footer Buttons bar */}
          <div className="pt-5 border-t border-slate-100 flex items-center justify-between gap-4 flex-wrap">
            <div>
              {saveSuccess && (
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
                  <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  System Settings Saved Successfully!
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 bg-[rgb(94,74,247)] hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Updating Node...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>

        </form>
      </div>

    </div>
  );
};

export default AdminSettings;
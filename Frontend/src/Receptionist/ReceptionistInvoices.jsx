import React, { useState, useEffect } from 'react';
import API from "../api/axios";

const ReceptionistInvoices = () => {
const [payLoading, setPayLoading] = useState(false);

const [showPayModal, setShowPayModal] = useState(false);
const [selectedInvoice, setSelectedInvoice] = useState(null);

const [paymentData, setPaymentData] = useState({
  amount: "",
  paymentMethod: ""
});

const handleOpenPayModal = (invoice) => {
  setSelectedInvoice(invoice);

  setPaymentData({
amount: invoice.totalAmount,
    paymentMethod: ""
  });

  setShowPayModal(true);
};

const handlePayBill = async () => {
console.log("SELECTED INVOICE:", selectedInvoice);
console.log("SENDING BILL ID:", selectedInvoice?.id);
  try {

    if (!paymentData.paymentMethod) {
      return alert("Please select payment method");
    }

    setPayLoading(true);

    const token = localStorage.getItem("token");

  const payload = {
  billId: selectedInvoice.id,   // FIXED
  amount: Number(paymentData.amount),
  paymentMethod: paymentData.paymentMethod
};
    const res = await API.patch(
      "/billing/pay",
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    alert(res.data.msg);

    setShowPayModal(false);

    fetchInvoices();

  } catch (error) {

  console.log("ERROR RESPONSE:");
  console.log(error.response?.data);

  alert(
    error?.response?.data?.msg ||
    "Payment failed"
  );


  } finally {

    setPayLoading(false);

  }

};

  const [searchTerm, setSearchTerm] = useState('');
  const [invoicesList, setInvoicesList] = useState([]);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/billing/all-invoices", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

const formatted = res.data.invoices.map((inv) => ({
  id: inv.id,  
  invoiceNumber: inv.invoiceNumber,
  guestName: inv.guestName,
  roomCharges: inv.roomCharges || 0,
  serviceCharges: inv.serviceCharges || 0,
  taxAmount: inv.taxAmount || 0,
  totalAmount: inv.totalAmount || 0,
  paidAmount: inv.paidAmount || 0,
  paymentStatus: inv.paymentStatus || "unpaid",
  paymentMethod: inv.paymentMethod || ""
}));
      setInvoicesList(formatted);

    } catch (error) {
      console.log(error);
    }
  };

  // Search logic
  const filteredInvoices = invoicesList.filter(invoice =>
    invoice.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'unpaid':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (

    
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* 📋 Header Section */}
      <div className="border-b border-slate-200 pb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Billing & Invoices Ledger</h1>
          <p className="text-sm text-slate-500 mt-1">Track financial transaction sessions, taxes, outstanding dues, and payment logs.</p>
        </div>
        
        {/* Search Bar filter tool */}
        <div className="relative w-full md:w-80">
          <input 
            type="text"
            placeholder="Search by name or invoice id..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-[rgb(94,74,247)] focus:ring-4 focus:ring-[rgb(94,74,247)]/5 transition-all text-slate-700"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* 📇 Invoices Grid Layout */}
      {filteredInvoices.length === 0 ? (
        <div className="p-12 text-center bg-white border border-slate-100 rounded-2xl text-slate-400 font-medium">
          No invoices located matching the active query index filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredInvoices.map((invoice) => (
            <div 
              key={invoice.id} 
              className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between overflow-hidden relative"
              style={{ border: '1px solid rgb(94, 74, 247)' }} 
            >
              
              {/* Card Meta Content Block */}
              <div className="space-y-4">
                
                {/* Header: ID Token and Status Badge */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Invoice Serial</span>
                    <h3 className="font-extrabold text-slate-900 text-sm">{invoice.invoiceNumber}</h3>
                  </div>
                  <span className={`text-[10px] font-bold border px-2.5 py-0.5 rounded-full uppercase tracking-wide ${getStatusStyle(invoice.paymentStatus)}`}>
                    {invoice.paymentStatus}
                  </span>
                </div>

                {/* Guest Profile Identity Info */}
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Client Identity</span>
                  <h4 className="font-bold text-slate-800 text-base mt-0.5">{invoice.guestName}</h4>
                </div>

                {/* Itemized Calculation Matrix Grid */}
                <div className="bg-slate-50/70 rounded-xl p-3.5 space-y-2 border border-slate-100 text-xs font-semibold">
                   <p className="pb-1">Reservation Dues</p> 
                  <div className="flex justify-between text-slate-500">
                    <span>Room Charges</span>
                    <span className="text-slate-700">PKR {invoice.roomCharges.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Service Amenities</span>
                    <span className="text-slate-700">PKR {invoice.serviceCharges.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-500 pb-2 border-b border-slate-200/60">
                    <span>Tax Amount (GST)</span>
                    <span className="text-slate-700">PKR {invoice.taxAmount.toLocaleString()}</span>
                  </div>
                  
                  {/* Gross Valuations Row */}
                  <div className="flex justify-between text-slate-800 font-extrabold text-sm pt-1">
                    <span>Total Amount</span>
                    <span className="text-slate-900">PKR {invoice.totalAmount.toLocaleString()}</span>
                  </div>
                </div>

                {/* Footer Allocation Balancing Logs */}
                <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Paid Amount</span>
                    <span className="font-extrabold text-emerald-600">PKR {invoice.paidAmount.toLocaleString()}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Payment Method</span>
<span
  className={`font-bold ${
    invoice.paymentMethod ? "text-slate-700" : "text-red-500"
  }`}
>
  {invoice.paymentMethod?.toUpperCase() || "Unpaid"}
</span>                  </div>
                </div>



                {/* PAY BILL BUTTON */}
{invoice.paymentStatus?.toLowerCase() === "unpaid" && (
  <div className="mt-5 pt-4 border-t border-slate-100">
    <button
      onClick={() => handleOpenPayModal(invoice)}
      className="w-full py-3 rounded-xl bg-[rgb(94,74,247)] text-white font-bold text-sm hover:opacity-90 transition-all"
    >
      Pay Bill
    </button>
  </div>
)}

              </div>

            </div>
          ))}
        </div>
      )}
{showPayModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">

    <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-fade-in">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-[rgb(94,74,247)] to-indigo-700 px-6 py-5 text-white">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-xs uppercase tracking-[3px] text-indigo-200 font-bold">
              Invoice Settlement
            </p>

            <h2 className="text-2xl font-black mt-1">
              Pay Outstanding Bill
            </h2>

          </div>

          <button
            onClick={() => setShowPayModal(false)}
            className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center"
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

        </div>

      </div>

      {/* BODY */}
      <div className="p-6 space-y-5">

        {/* Invoice Number */}

        <div>

          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Invoice Number
          </label>

          <div className="relative">

            <svg
              className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h6m-6 4h6M7 4h10a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V6a2 2 0 012-2z"
              />
            </svg>

            <input
              value={selectedInvoice?.invoiceNumber || ""}
              readOnly
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 font-bold text-slate-700"
            />

          </div>

        </div>

        {/* Amount */}

        <div>

          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Amount
          </label>

          <div className="relative">

            <svg
              className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8c-2 0-3 1-3 2s1 2 3 2 3 1 3 2-1 2-3 2m0-10v10"
              />
            </svg>

            <input
  type="number"
  value={paymentData.amount}
  readOnly
  className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 font-bold text-slate-700"
/>

          </div>

        </div>

        {/* Payment Method */}

        <div>

          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Payment Method
          </label>

          <select
  value={paymentData.paymentMethod}
  onChange={(e) =>
    setPaymentData({
      ...paymentData,
      paymentMethod: e.target.value
    })
  }
  className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white outline-none focus:border-[rgb(94,74,247)]"
>
  <option value="">Select Payment Method</option>
  <option value="cash">Cash</option>
  <option value="card">Card</option>
  <option value="online">Online</option>
</select>
        </div>

        {/* Summary Card */}

        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">

          <div className="flex justify-between text-sm">
            <span className="text-slate-500">
              Outstanding Balance
            </span>

            <span className="font-black text-[rgb(94,74,247)]">
              PKR {Number(paymentData.amount).toLocaleString()}
            </span>
          </div>

        </div>

      </div>

      {/* FOOTER */}

      <div className="border-t border-slate-100 p-5 flex gap-3">

        <button
          onClick={() => setShowPayModal(false)}
          className="flex-1 py-3 rounded-2xl border border-slate-200 font-bold text-slate-600"
        >
          Cancel
        </button>

      <button
  onClick={handlePayBill}
   disabled={payLoading || !paymentData.paymentMethod}
  className="flex-1 py-3 rounded-2xl bg-[rgb(94,74,247)] text-white font-black shadow-lg shadow-[rgb(94,74,247)]/20 disabled:opacity-60"
>
  {
    payLoading
      ? "PROCESSING..."
      : "Confirm Payment"
  }
</button>

      </div>

    </div>

  </div>
)}
    </div>
    
  );

  
};

export default ReceptionistInvoices;
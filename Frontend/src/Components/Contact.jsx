import { useEffect, useState } from "react";
import API from "../api/axios";


const Contactus = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        subject: '',
        message: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const validate = () => {
        let tempErrors = {};
        if (!formData.fullName.trim()) tempErrors.fullName = "Name is required";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email) {
            tempErrors.email = "Email is required";
        } else if (!emailRegex.test(formData.email)) {
            tempErrors.email = "Invalid email format";
        }
        if (!formData.subject.trim()) tempErrors.subject = "Subject is required";
        if (formData.message.length < 10) tempErrors.message = "Message must be at least 10 characters";
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isLoggedIn) {
            alert("Please login first to send message");
            return;
        }

        if (!validate()) return;

        try {
            setIsSubmitting(true);

            const token = localStorage.getItem("token");

            const response = await API.post(
                "/contact/create",
                {
                    subject: formData.subject,
                    message: formData.message
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log(response.data);

            setIsSuccess(true);

            setFormData((prev) => ({
                ...prev,
                subject: "",
                message: ""
            }));

            setTimeout(() => setIsSuccess(false), 5000);

        } catch (error) {
            console.log(error);
            alert(error?.response?.data?.msg || "Failed to send message");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) setErrors({ ...errors, [name]: "" });
    };


    useEffect(() => {
        getCurrentUser();
    }, []);

    const getCurrentUser = async () => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                setIsLoggedIn(false);
                return;
            }

            const response = await API.get("/guest/my-profile", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const user = response.data.guest || response.data.user;

            if (user) {
                setIsLoggedIn(true);

                setFormData((prev) => ({
                    ...prev,
                    fullName: user.name || "",
                    email: user.email || ""
                }));
            }

        } catch (error) {
            console.log(error);
            setIsLoggedIn(false);
        }
    };

    return (
        <div className="bg-white py-12 md:py-24 px-4 md:px-6 font-sans" id="contact">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12 md:mb-16">
                    <span className="text-indigo-600 text-xs font-bold uppercase tracking-[0.4em] mb-4 block">Get In Touch</span>
                    <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6">Contact <span className="text-indigo-600">Luxury Stay</span></h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-stretch">

                    {/* Form Section */}
                    <div className="bg-[#fcfcfd] border border-gray-100 p-6 md:p-12 rounded-2rem md:rounded-[2.5rem] shadow-sm relative overflow-hidden">
                        {isSuccess && (
                            <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl border border-green-200 text-sm font-medium animate-pulse text-center">
                                Thank you! Your message has been sent successfully.
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                                <div>
                                    <label className="block text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Full Name</label>
                                    <input
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        type="text"
                                        placeholder="John Doe"
                                        className={`w-full px-5 py-3.5 md:py-4 rounded-2xl border outline-none transition-all text-sm ${errors.fullName ? 'border-red-400 bg-red-50/30' : 'border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50'}`}
                                    />
                                    {errors.fullName && <p className="text-red-500 text-[10px] mt-1 font-bold ml-1 uppercase">{errors.fullName}</p>}
                                </div>
                                <div>
                                    <label className="block text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Email Address</label>
                                    <input
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        type="email"
                                        placeholder="john@example.com"
                                        className={`w-full px-5 py-3.5 md:py-4 rounded-2xl border outline-none transition-all text-sm ${errors.email ? 'border-red-400 bg-red-50/30' : 'border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50'}`}
                                    />
                                    {errors.email && <p className="text-red-500 text-[10px] mt-1 font-bold ml-1 uppercase">{errors.email}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Subject</label>
                                <input
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    type="text"
                                    placeholder="Room Reservation"
                                    className={`w-full px-5 py-3.5 md:py-4 rounded-2xl border outline-none transition-all text-sm ${errors.subject ? 'border-red-400 bg-red-50/30' : 'border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50'}`}
                                />
                                {errors.subject && <p className="text-red-500 text-[10px] mt-1 font-bold ml-1 uppercase">{errors.subject}</p>}
                            </div>

                            <div>
                                <label className="block text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Your Message</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows="4"
                                    placeholder="Tell us about your stay..."
                                    className={`w-full px-5 py-3.5 md:py-4 rounded-2xl border outline-none transition-all resize-none text-sm ${errors.message ? 'border-red-400 bg-red-50/30' : 'border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50'}`}
                                ></textarea>
                                {errors.message && <p className="text-red-500 text-[10px] mt-1 font-bold ml-1 uppercase">{errors.message}</p>}
                            </div>
                            {!isLoggedIn && (
                                <div className="bg-amber-50 border border-amber-200 text-amber-700 text-xs rounded-xl px-4 py-3 font-medium">
                                    Please login first to send message.
                                </div>
                            )}
                            <button
                                disabled={isSubmitting || !isLoggedIn}
                                className={`w-full font-bold py-4 md:py-5 rounded-2xl shadow-lg transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'}`}
                            >
                                {isSubmitting ? 'Sending...' : 'Send Message'}
                                {!isSubmitting && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>}
                            </button>
                        </form>
                    </div>

                    {/* Optimized Responsive Map */}
                    <div className="relative w-full aspect-square md:aspect-auto rounded-2rem md:rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100 min-h-350px md:min-h-full group">
                        <iframe
                            title="Hotel Location"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.142293761906!2d-73.98731968459391!3d40.75889497932681!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25855c6480293%3A0x5119f4441dd44e3!2sTimes%20Square!5e0!3m2!1sen!2sus!4v1625573423547!5m2!1sen!2sus"
                            width="100%"
                            height="100%"
                            style={{ border: 0, filter: 'grayscale(0.3) contrast(1.1)' }}
                            loading="lazy"
                            className="grayscale hover:grayscale-0 transition-all duration-700"
                        ></iframe>

                        {/* Address Card: Optimized for Mobile */}
                        <div className="absolute bottom-4 left-4 right-4 md:bottom-auto md:left-auto md:top-6 md:right-6 bg-white/95 backdrop-blur-md p-4 md:p-5 rounded-2xl shadow-2xl border border-white/50">
                            <div className="flex items-center gap-3 md:block">
                                <div className="bg-indigo-600 p-2 rounded-lg md:hidden">
                                    <svg className="text-white w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-0.5 md:mb-1">Luxury Stay HQ</p>
                                    <p className="text-xs text-gray-700 font-bold leading-tight">
                                        123 Manhattan Tower,<br className="hidden md:block" /> New York, NY 10036
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Contactus;
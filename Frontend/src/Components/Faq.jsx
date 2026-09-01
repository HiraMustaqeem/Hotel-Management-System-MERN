import React from 'react';

const Faq = () => {
    const [openIndex, setOpenIndex] = React.useState(-1);

    const faqs = [
        {
            question: "What are the standard check-in and check-out times?",
            answer: "Our standard check-in time is 2:00 PM and check-out is at 12:00 PM. Early check-in or late check-out requests are subject to room availability and may incur additional charges."
        },
        {
            question: "Is breakfast included in the room rate?",
            answer: "Most of our luxury suites include a complimentary gourmet breakfast buffet. For standard bookings, breakfast can be added at the time of check-in or through our room service menu."
        },
        {
            question: "Do you offer airport shuttle services?",
            answer: "Yes, we provide premium airport pick-up and drop-off services. Please share your flight details with our concierge desk at least 24 hours in advance to schedule your ride."
        },
        {
            question: "What is your cancellation and refund policy?",
            answer: "Cancellations made up to 48 hours before the scheduled arrival will receive a full refund. For cancellations made within 48 hours, a one-night stay charge will apply."
        },
        {
            question: "Are pets allowed in the hotel?",
            answer: "To ensure the comfort of all our guests, we have specific pet-friendly rooms available upon request. Please contact us directly to check availability for your furry friends."
        }
    ];

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? -1 : index);
    };

    return (
        <div className="bg-[#fcfcfd] flex items-center justify-center py-24 px-4 font-sans">
            <div className="w-full max-w-3xl">
                <div className="text-center mb-16">
                    <span className="text-indigo-600 text-xs font-bold uppercase tracking-[0.4em] mb-4 block">Concierge Desk</span>
                    <h2 className="text-4xl font-black text-gray-900 mb-4">Frequently Asked Questions</h2>
                    <p className="text-gray-500 text-sm max-w-md mx-auto">Find answers to the most common questions regarding your stay, bookings, and our premium amenities.</p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div key={index} className="group">
                            <div className={`bg-white border transition-all duration-300 rounded-2xl overflow-hidden ${openIndex === index ? 'border-indigo-500 shadow-xl shadow-indigo-100/50' : 'border-gray-200 hover:border-gray-300'}`}>
                                <button 
                                    onClick={() => toggleFAQ(index)} 
                                    className="w-full flex items-center justify-between p-6 text-left transition-colors"
                                >
                                    <span className={`text-[16px] font-bold transition-colors ${openIndex === index ? 'text-indigo-600' : 'text-gray-800'}`}>
                                        {faq.question}
                                    </span>
                                    <span className="shrink-0 ml-4">
                                        <div className={`size-8 rounded-full flex items-center justify-center transition-all duration-300 ${openIndex === index ? 'bg-indigo-600 rotate-45' : 'bg-gray-100'}`}>
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M12 5v14M5 12h14" stroke={openIndex === index ? "#fff" : "#666"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                    </span>
                                </button>

                                <div className={`transition-all duration-500 ease-in-out ${openIndex === index ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'}`}>
                                    <div className="px-6 pb-6">
                                        <div className="w-full h-1px bg-gray-50 mb-4"></div>
                                        <p className="text-[15px] font-normal text-gray-600 leading-relaxed">
                                            {faq.answer}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Faq;
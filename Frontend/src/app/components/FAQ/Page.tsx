'use client';

import React, { useState } from 'react';

interface FaqItemProps {
  number: string;
  title: string;
  content: string;
  isOpen: boolean;
  onClick: () => void;
  isFirst?: boolean;
}

const FaqItem: React.FC<FaqItemProps> = ({
  number,
  title,
  content,
  isOpen,
  onClick,
  isFirst = false,
}) => {
  return (
    <div className={`relative flex flex-col items-center p-4 rounded-xl cursor-pointer transition-colors duration-200 border border-black
      ${isOpen ? 'bg-yellow-400' : 'bg-gray-50'}`}>
      <div
        className="flex items-center justify-between w-full cursor-pointer"
        onClick={onClick}
      >
        <h3 className="text-xl font-bold flex items-center">
          <span className="mr-4 text-black text-2xl font-extrabold">{number}</span>
          <span className="text-black text-lg sm:text-xl md:text-2xl">{title}</span>
        </h3>
        <button className="p-2 rounded-full border-2 border-black text-black text-lg">
          {isOpen ? '-' : '+'}
        </button>
      </div>
      {isOpen && (
        <div className="w-full p-4 border-t-2 border-black text-black mt-4">
          <p>{content}</p>
        </div>
      )}
    </div>
  );
};

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0); 

  const faqs = [
    {
      number: '01',
      title: 'What services does Track-n-Fix provide?',
      content: "Track-n-Fix offers a wide range of services including Women's Salon & Spa, Men's Salon & Massage, AC & Appliance Repair, Cleaning, Electrician, Plumber & Carpenter, Native Water Purifier, Native Smart Locks, Full home painting, and Pest Control.",
    },
    {
      number: '02',
      title: 'How do I book a service?',
      content: 'You can book a service directly through our website by navigating to the specific service page and following the booking instructions.',
    },
    {
      number: '03',
      title: 'Are your technicians verified?',
      content: 'Yes, all our technicians are thoroughly vetted and highly experienced professionals.',
    },
    {
      number: '04',
      title: 'What if I need to reschedule or cancel?',
      content: 'You can easily reschedule or cancel your booking through your user dashboard or by contacting our customer support.',
    },
    {
      number: '05',
      title: 'Do you offer emergency services?',
      content: 'For urgent needs, please contact our helpline directly, and we will do our best to assist you.',
    },
  ];

  const handleItemClick = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center pt-8 pb-8 px-2 sm:px-4 max-w-4xl mx-auto">
      <div className="w-full p-2 sm:p-6 bg-white">
        <div className="flex flex-col gap-4">
          {faqs.map((faq, index) => (
            <FaqItem
              key={index}
              number={faq.number}
              title={faq.title}
              content={faq.content}
              isOpen={openIndex === index}
              onClick={() => handleItemClick(index)}
              isFirst={index === 0}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default FAQ; 
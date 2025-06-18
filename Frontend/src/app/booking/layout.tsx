import React from 'react';

interface BookingLayoutProps {
  children: React.ReactNode;
}

const BookingLayout: React.FC<BookingLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
};

export default BookingLayout; 
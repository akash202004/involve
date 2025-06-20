import React from 'react';
import { Review } from '../(dashboard)/types/dashboard-types';

interface RecentReviewsProps {
  reviews: Review[];
  isDemo?: boolean;
}

const RecentReviews: React.FC<RecentReviewsProps> = ({ reviews, isDemo = false }) => {
  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div 
          key={review.id} 
          className={`border-b border-gray-200 pb-4 last:border-0 last:pb-0 ${isDemo ? 'bg-yellow-50 px-4 py-3 rounded-lg' : ''}`}
        >
          <div className="flex items-center justify-between mb-1">
            <div>
              <p className="font-medium text-gray-900">
                {review.userName}
                {isDemo && <span className="ml-2 text-xs text-yellow-600">(Demo)</span>}
              </p>
              <p className="text-sm text-gray-500">
                for {review.workerName} ({review.serviceType})
              </p>
            </div>
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              {isDemo && (
                <span className="ml-2 text-xs text-yellow-600">
                  {review.rating}.0
                </span>
              )}
            </div>
          </div>
          <p className="text-gray-600 text-sm">{review.comment}</p>
          <p className="text-gray-400 text-xs mt-1">
            {new Date(review.date).toLocaleDateString()}
            {isDemo && <span className="ml-2 text-yellow-500">• Sample Review</span>}
          </p>
        </div>
      ))}
    </div>
  );
};

export default RecentReviews;
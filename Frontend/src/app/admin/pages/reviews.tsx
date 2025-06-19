'use client'
import React from 'react';
import useDashboardData from '../hooks/useDashboardData';
import RecentReviews  from '../components/RecentReviews';

const ReviewsPage: React.FC = () => {
  const { reviews, loading, error } = useDashboardData();

  if (loading) return <div className="p-8 text-center">Loading reviews...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">All Reviews</h3>
            {reviews.length > 0 ? (
              <RecentReviews reviews={reviews} />
            ) : (
              <p className="text-gray-500">No reviews available</p>
            )}
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Review Statistics</h3>
          {reviews.length > 0 ? (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-500">Total Reviews:</span>
                <span className="text-sm font-medium">{reviews.length}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-500">Average Rating:</span>
                <div className="flex items-center">
                  <span className="text-sm font-medium mr-1">
                    {(reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)}
                  </span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${i < Math.round(reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length) ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Rating Distribution</h4>
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = reviews.filter(r => r.rating === rating).length;
                  const percentage = (count / reviews.length) * 100;
                  
                  return (
                    <div key={rating} className="flex items-center mb-1">
                      <span className="text-sm w-8">{rating} star</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2.5 mx-2">
                        <div
                          className="bg-yellow-400 h-2.5 rounded-full"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm w-8 text-right">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No review statistics available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewsPage;
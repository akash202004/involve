'use client'
import React from 'react';
import useDashboardData from '../../hooks/useDashboardData';
import RecentReviews from '../../components/RecentReviews';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

// Generate realistic dummy reviews
const generateDummyReviews = (count: number) => {
  const services = ['mechanic', 'electrician', 'plumber', 'carpenter', 'cleaner'];
  const comments = [
    'Excellent service! Will definitely hire again.',
    'Professional and efficient work',
    'Arrived on time and fixed the issue quickly',
    'Fair pricing and quality work',
    'Highly recommended for any home service',
    'Good service but a bit expensive',
    'Did the job but could be more punctual'
  ];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `review-${i + 1}`,
    userId: `user-${Math.floor(Math.random() * 50) + 1}`,
    userName: `User ${Math.floor(Math.random() * 50) + 1}`,
    workerId: `worker-${Math.floor(Math.random() * 20) + 1}`,
    workerName: `Worker ${Math.floor(Math.random() * 20) + 1}`,
    rating: Math.floor(Math.random() * 5) + 1,
    comment: comments[Math.floor(Math.random() * comments.length)],
    date: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)),
    serviceType: services[Math.floor(Math.random() * services.length)],
  }));
};

const ReviewsPage: React.FC = () => {
  const { reviews, loading, error, usingDummyData } = useDashboardData();
  const dummyReviews = generateDummyReviews(15);
  const displayReviews = usingDummyData ? dummyReviews : reviews;

  if (loading) return <div className="p-8 text-center">Loading reviews...</div>;
  if (error && !usingDummyData) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Customer Reviews</h1>
        {usingDummyData && (
          <div className="flex items-center bg-yellow-50 text-yellow-700 px-4 py-2 rounded-md">
            <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
            <span className="text-sm">Showing demo review data</span>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className={`bg-white shadow rounded-lg p-6 ${usingDummyData ? 'border-l-4 border-yellow-400' : ''}`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">All Reviews</h3>
              {usingDummyData && (
                <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                  Demo Data
                </span>
              )}
            </div>
            {displayReviews.length > 0 ? (
              <RecentReviews reviews={displayReviews} isDemo={usingDummyData} />
            ) : (
              <p className="text-gray-500">No reviews available</p>
            )}
          </div>
        </div>
        
        <div className={`bg-white shadow rounded-lg p-6 ${usingDummyData ? 'border-l-4 border-yellow-400' : ''}`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Review Statistics</h3>
            {usingDummyData && (
              <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                Demo Stats
              </span>
            )}
          </div>
          {displayReviews.length > 0 ? (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-500">Total Reviews:</span>
                <span className="text-sm font-medium">{displayReviews.length}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-500">Average Rating:</span>
                <div className="flex items-center">
                  <span className="text-sm font-medium mr-1">
                    {(displayReviews.reduce((sum, review) => sum + review.rating, 0) / displayReviews.length).toFixed(1)}
                  </span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${i < Math.round(displayReviews.reduce((sum, review) => sum + review.rating, 0) / displayReviews.length) ? 'text-yellow-400' : 'text-gray-300'}`}
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
                  const count = displayReviews.filter(r => r.rating === rating).length;
                  const percentage = (count / displayReviews.length) * 100;
                  
                  return (
                    <div key={rating} className="flex items-center mb-1">
                      <span className="text-sm w-8">{rating} star</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2.5 mx-2">
                        <div
                          className={`h-2.5 rounded-full ${usingDummyData ? 'bg-yellow-300' : 'bg-yellow-400'}`}
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

      {usingDummyData && (
        <div className="mt-6 p-4 bg-yellow-50 rounded-lg text-sm text-yellow-700">
          <p><strong>Demo Review Data Notice:</strong> This dashboard is currently displaying sample review information.</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>All user names, ratings, and comments are randomly generated</li>
            <li>Review statistics reflect this demo dataset only</li>
            <li>Real customer reviews will appear when connected to your live API</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ReviewsPage;
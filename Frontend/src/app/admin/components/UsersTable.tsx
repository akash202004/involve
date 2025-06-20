import React from 'react';
import { User } from '../(dashboard)/types/dashboard-types';
import { 
  UserCircleIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  CalendarIcon, 
  BookmarkIcon 
} from '@heroicons/react/24/solid';

interface UsersTableProps {
  users: User[];
  isDemo?: boolean;
  searchTerm: string;
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  onSearchChange: (term: string) => void;
}

export const UsersTable: React.FC<UsersTableProps> = ({ 
  users, 
  isDemo = false,
  searchTerm,
  activeFilter,
  onFilterChange,
  onSearchChange
}) => {
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'all' || 
                        (activeFilter === 'active' && user.bookings > 0) ||
                        (activeFilter === 'new' && (Date.now() - new Date(user.joinDate).getTime()) < 30 * 24 * 60 * 60 * 1000);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search users..."
            className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" 
               fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <div className="flex gap-2">
          {['all', 'active', 'new'].map((filter) => (
            <button
              key={filter}
              onClick={() => onFilterChange(filter)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                activeFilter === filter
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {filter === 'all' && 'All'}
              {filter === 'active' && 'Active'}
              {filter === 'new' && 'New'}
            </button>
          ))}
        </div>
      </div>

      {/* User Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredUsers.map((user) => (
          <div 
            key={user.id} 
            className={`relative bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all duration-300 ${
              isDemo ? 'border-l-4 border-amber-400' : ''
            }`}
          >
            {/* User avatar and basic info */}
            <div className="p-5 pb-0">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                    <UserCircleIcon className="h-7 w-7 text-indigo-600" />
                  </div>
                  {user.bookings > 0 && (
                    <span className="absolute -bottom-1 -right-1 bg-green-500 text-white text-xs font-bold h-5 w-5 rounded-full flex items-center justify-center">
                      {user.bookings}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 flex items-center">
                    {user.name}
                    {isDemo && (
                      <span className="ml-2 text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">Demo</span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-500">Joined {new Date(user.joinDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* User details */}
            <div className="p-5 pt-3">
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <EnvelopeIcon className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-600 truncate">{user.email}</span>
                </div>
                <div className="flex items-center text-sm">
                  <PhoneIcon className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-600">{user.phone || 'Not provided'}</span>
                </div>
                <div className="flex items-center text-sm">
                  <BookmarkIcon className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-600">
                    {user.bookings} booking{user.bookings !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto h-24 w-24 text-gray-300 mb-4">
            <UserCircleIcon className="h-full w-full" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">No users found</h3>
          <p className="mt-1 text-gray-500">
            {searchTerm ? 'Try a different search term' : 'No users match your current filters'}
          </p>
        </div>
      )}

      {/* Demo mode notice */}
      {isDemo && (
        <div className="p-4 bg-amber-50 border border-amber-100 rounded-lg text-sm text-amber-700">
          <p>This is displaying demonstration data. Real user data will appear when connected to your API.</p>
        </div>
      )}
    </div>
  );
};
"use client";

import { useUser } from '@civic/auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/app/components/ui/LoadingSpinner';
import Link from 'next/link';
// @ts-ignore
import { v4 as uuidv4 } from 'uuid';

interface UserProfile {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  autoLocation: string;
}

export default function ProfilePage() {
  const { user, isLoading: authLoading, signOut } = useUser();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile>({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    autoLocation: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  // Load user data when authenticated
  useEffect(() => {
    if (user) {
      const loadProfile = async () => {
        setIsLoading(true);
        try {
          // Fetch profile from backend using email
          const email = user.email ?? '';
          const response = await fetch(`http://localhost:5000/api/v1/users?email=${encodeURIComponent(email)}`);
          if (response.ok) {
            const data = await response.json();
            // If backend returns an array of users, pick the first one
            const userData = Array.isArray(data) ? data[0] : data;
            setProfile({
              firstName: userData.firstName || '',
              lastName: userData.lastName || '',
              phoneNumber: userData.phoneNumber || '',
              email: user.email || '',
              autoLocation: userData.autoLocation || '',
            });
          } else {
            // Initialize with auth email if no profile exists
            setProfile(prev => ({
              ...prev,
              email: user.email || '',
              autoLocation: '',
            }));
          }
        } catch (error) {
          console.error('Error loading profile:', error);
        } finally {
          setIsLoading(false);
        }
      };

      loadProfile();
    }
  }, [user]);

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      // Ensure phoneNumber is 12 digits (e.g., '91' + 10 digit number)
      let phoneNumber = profile.phoneNumber;
      if (phoneNumber.length === 10) {
        phoneNumber = '91' + phoneNumber;
      }
      if (phoneNumber.length !== 12) {
        alert('Phone number must be 12 digits (including country code, e.g., 91XXXXXXXXXX)');
        setIsSubmitting(false);
        return;
      }
      // Generate or retrieve user id
      let userId: string = localStorage.getItem('userId') || '';
      if (!userId) {
        userId = uuidv4();
        localStorage.setItem('userId', userId);
      }
      const requestBody = {
        id: userId,
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        phoneNumber: phoneNumber,
        autoLocation: profile.autoLocation,
      };
      console.log("Request body:", requestBody);
      const response = await fetch('http://localhost:5000/api/v1/users/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error('Failed to save profile');
      }

      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in to view your profile</h1>
          <p className="text-gray-600">Redirecting to home page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8 mt-16">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 px-6 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white">Profile</h1>
                <p className="text-yellow-100 mt-1">Manage your account information</p>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="px-6 py-8">
            <div className="space-y-6">
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  value={profile.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 border rounded-md ${
                    isEditing 
                      ? 'border-gray-300 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 bg-white' 
                      : 'border-gray-300 bg-white text-gray-500 cursor-not-allowed'
                  }`}
                    placeholder="Enter your first name"
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  value={profile.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 border rounded-md ${
                    isEditing 
                      ? 'border-gray-300 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 bg-white' 
                      : 'border-gray-300 bg-white text-gray-500 cursor-not-allowed'
                  }`}
                    placeholder="Enter your last name"
                />
              </div>

              {/* Email (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-500 cursor-not-allowed"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={profile.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 border rounded-md ${
                    isEditing 
                      ? 'border-gray-300 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 bg-white' 
                      : 'border-gray-300 bg-white text-gray-500 cursor-not-allowed'
                  }`}
                  placeholder="Enter your phone number (e.g., 91XXXXXXXXXX)"
                  maxLength={12}
                />
              </div>

              {/* Auto Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Auto Location
                </label>
                <input
                  type="text"
                  value={profile.autoLocation}
                  onChange={(e) => handleInputChange('autoLocation', e.target.value)}
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 border rounded-md ${
                    isEditing 
                      ? 'border-gray-300 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 bg-white' 
                      : 'border-gray-300 bg-white text-gray-500 cursor-not-allowed'
                  }`}
                  placeholder="Enter your location or allow location access"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-md transition-colors duration-200 flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Profile
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleSave}
                      disabled={isSubmitting}
                      className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-6 py-2 rounded-md transition-colors duration-200 flex items-center gap-2"
                    >
                      {isSubmitting ? (
                        <LoadingSpinner size="sm" />
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                      {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md transition-colors duration-200"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
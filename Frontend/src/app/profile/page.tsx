"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/app/components/ui/LoadingSpinner';
import Link from 'next/link';
// @ts-ignore
import { v4 as uuidv4 } from 'uuid';
import { useUser, SignInButton } from '@clerk/nextjs';

interface UserProfile {
  id?: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  autoLocation: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: number;
}

export default function ProfilePage() {
  const { isSignedIn, user, isLoaded } = useUser();
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
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Load user data when authenticated
  useEffect(() => {
    if (user) {
      setProfile(prev => ({
        ...prev,
        email: user.primaryEmailAddress?.emailAddress || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
      }));
      // Optionally, fetch more profile data from your backend here
    }
  }, [user]);

  const handleInputChange = (field: keyof UserProfile, value: string | number) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validatePhoneNumber = (phone: string): string => {
    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, '');
    
    // If it's 10 digits, add country code
    if (digits.length === 10) {
      return '91' + digits;
    }
    
    // If it's already 12 digits with country code, return as is
    if (digits.length === 12) {
      return digits;
    }
    
    // If it's 11 digits and starts with 0, remove 0 and add 91
    if (digits.length === 11 && digits.startsWith('0')) {
      return '91' + digits.substring(1);
    }
    
    return digits;
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Validate required fields
      if (!profile.firstName.trim()) {
        setError('First name is required');
        setIsSubmitting(false);
        return;
      }
      
      if (!profile.lastName.trim()) {
        setError('Last name is required');
        setIsSubmitting(false);
        return;
      }
      
      if (!profile.phoneNumber.trim()) {
        setError('Phone number is required');
        setIsSubmitting(false);
        return;
      }

      // Validate and format phone number
      const formattedPhone = validatePhoneNumber(profile.phoneNumber);
      if (formattedPhone.length !== 12) {
        setError('Phone number must be 12 digits (including country code, e.g., 91XXXXXXXXXX)');
        setIsSubmitting(false);
        return;
      }

      // Prepare request body
      const requestBody = {
        firstName: profile.firstName.trim(),
        lastName: profile.lastName.trim(),
        email: profile.email,
        phoneNumber: formattedPhone,
        autoLocation: profile.autoLocation.trim(),
        address: profile.address?.trim() || undefined,
        city: profile.city?.trim() || undefined,
        state: profile.state?.trim() || undefined,
        country: profile.country?.trim() || undefined,
        zipCode: profile.zipCode || undefined,
      };

      let response;
      
      if (profile.id) {
        // Update existing user
        response = await fetch(`http://localhost:5000/api/v1/users/${profile.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });
      } else {
        // Create new user
        const userId = uuidv4();
        localStorage.setItem('userId', userId);
        
        response = await fetch('http://localhost:5000/api/v1/users/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: userId,
            ...requestBody,
          }),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.message || 'Failed to save profile');
      }

      const result = await response.json();
      
      // Update profile with the returned data
      if (result.data) {
        setProfile(prev => ({
          ...prev,
          id: result.data.id,
          firstName: result.data.firstName,
          lastName: result.data.lastName,
          phoneNumber: result.data.phoneNumber,
          autoLocation: result.data.autoLocation || '',
          address: result.data.address || '',
          city: result.data.city || '',
          state: result.data.state || '',
          country: result.data.country || '',
          zipCode: result.data.zipCode || undefined,
        }));
      }
      
      setSuccess('Profile saved successfully!');
      setIsEditing(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
      
    } catch (error: any) {
      console.error('Error saving profile:', error);
      setError(error.message || 'Failed to save profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoaded && !isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <SignInButton />
          <p className="mt-4 text-gray-600">Please sign in to view your profile.</p>
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
            <div className="flex justify-between items-center mb-4">
              <div>
                <h1 className="text-3xl font-bold text-white">Profile</h1>
                <p className="text-yellow-100 mt-1">Manage your account information</p>
              </div>
            </div>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="px-6 py-4 bg-red-50 border-l-4 border-red-400">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {success && (
            <div className="px-6 py-4 bg-green-50 border-l-4 border-green-400">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">{success}</p>
                </div>
              </div>
            </div>
          )}

          {/* Profile Content */}
          <div className="px-6 py-8">
            <div className="space-y-6">
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
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
                  Last Name *
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
                  Phone Number *
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
                  placeholder="Enter your phone number (e.g., 91XXXXXXXXXX or XXXXXXXXXX)"
                  maxLength={12}
                />
                {isEditing && (
                  <p className="mt-1 text-sm text-gray-500">
                    Enter 10 digits (will auto-add 91) or 12 digits with country code
                  </p>
                )}
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

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <textarea
                  value={profile.address || ''}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  disabled={!isEditing}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-md ${
                    isEditing 
                      ? 'border-gray-300 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 bg-white' 
                      : 'border-gray-300 bg-white text-gray-500 cursor-not-allowed'
                  }`}
                  placeholder="Enter your full address"
                />
              </div>

              {/* City, State, Country Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={profile.city || ''}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border rounded-md ${
                      isEditing 
                        ? 'border-gray-300 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 bg-white' 
                        : 'border-gray-300 bg-white text-gray-500 cursor-not-allowed'
                    }`}
                    placeholder="City"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    value={profile.state || ''}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border rounded-md ${
                      isEditing 
                        ? 'border-gray-300 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 bg-white' 
                        : 'border-gray-300 bg-white text-gray-500 cursor-not-allowed'
                    }`}
                    placeholder="State"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    value={profile.country || ''}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border rounded-md ${
                      isEditing 
                        ? 'border-gray-300 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 bg-white' 
                        : 'border-gray-300 bg-white text-gray-500 cursor-not-allowed'
                    }`}
                    placeholder="Country"
                  />
                </div>
              </div>

              {/* Zip Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Zip Code
                </label>
                <input
                  type="number"
                  value={profile.zipCode || ''}
                  onChange={(e) => handleInputChange('zipCode', parseInt(e.target.value) || undefined)}
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 border rounded-md ${
                    isEditing 
                      ? 'border-gray-300 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 bg-white' 
                      : 'border-gray-300 bg-white text-gray-500 cursor-not-allowed'
                  }`}
                  placeholder="Zip Code"
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
                      onClick={() => {
                        setIsEditing(false);
                        setError(null);
                        setSuccess(null);
                      }}
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
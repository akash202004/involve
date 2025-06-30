# User Registration System

This document explains how user registration works when users sign in with Clerk in the Hexafall application.

## Overview

When a user signs in with Clerk, their information is automatically synchronized with the backend database. The system uses a dual approach:

1. **Clerk Webhook** (Primary method)
2. **Frontend Fallback** (Secondary method)

## How It Works

### 1. Clerk Webhook (Primary Method)

- **File**: `frontend/src/app/api/clerk-webhook/route.ts`
- **Trigger**: When a user is created in Clerk
- **Data Sent**:
  ```json
  {
    "firstName": "Akash",
    "lastName": "Laha",
    "email": "akash@gmail.com",
    "phoneNumber": "916296673240"
  }
  ```

### 2. Frontend Fallback (Secondary Method)

- **Hook**: `useEnsureUser` in `frontend/src/lib/useEnsureUser.ts`
- **Trigger**: When user signs in and webhook might have failed
- **Integration**: Used in the Navbar component

## Navbar Integration

The Navbar component (`frontend/src/app/components/Navbar/Page.tsx`) now includes:

### Features Added:

1. **Automatic User Registration**: Uses `useEnsureUser` hook to ensure user exists in backend
2. **Loading Indicators**: Shows sync status in profile menu
3. **Status Messages**:
   - "Syncing your account..." (blue) - during registration
   - "✓ Account synced" (green) - successful registration
   - "⚠ Sync failed" (red) - registration failed
4. **Toast Notifications**: Welcome messages and error alerts
5. **Disabled States**: Buttons disabled during registration process

### Visual Indicators:

- **Desktop**: Blue pulsing dot on profile icon during sync
- **Mobile**: Status messages in mobile menu
- **Both**: Toast notifications for success/error states

## Backend API

### User Creation Endpoint

- **URL**: `POST /api/v1/users`
- **Expected Data**:
  ```json
  {
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "phoneNumber": "string (12 digits)",
    "address": "string (optional)",
    "city": "string (optional)",
    "state": "string (optional)",
    "country": "string (optional)"
  }
  ```

### Database Schema

The user data is stored in the `users` table with the following structure:

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firstName VARCHAR(50) NOT NULL,
  lastName VARCHAR(50) NOT NULL,
  email VARCHAR NOT NULL,
  phoneNumber VARCHAR(12) NOT NULL,
  password VARCHAR(30),
  address TEXT,
  city VARCHAR(50),
  state VARCHAR(50),
  country VARCHAR(50),
  zipCode INTEGER,
  autoLocation TEXT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  createdAt TIMESTAMP DEFAULT NOW()
);
```

## Environment Variables

Make sure these environment variables are set:

```env
# Frontend
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000

# Backend
CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret
```

## Testing

To test the user registration:

1. **Sign in with Clerk** - User should be automatically registered
2. **Check Backend** - Verify user appears in database
3. **Check UI** - Look for sync status indicators
4. **Check Console** - Look for registration logs

## Error Handling

The system handles various error scenarios:

- **Network errors**: Retry mechanism in `useEnsureUser`
- **Validation errors**: Backend validation with detailed error messages
- **Duplicate users**: Prevents duplicate email registrations
- **Missing data**: Fallback to default values

## Security

- **Webhook verification**: Uses Svix for webhook signature verification
- **Data validation**: Zod schema validation on backend
- **Phone number formatting**: Automatic country code addition
- **Error logging**: Comprehensive error tracking

## Troubleshooting

### Common Issues:

1. **User not appearing in backend**:

   - Check webhook configuration in Clerk dashboard
   - Verify `CLERK_WEBHOOK_SECRET` environment variable
   - Check backend logs for errors

2. **Sync status not updating**:

   - Check network connectivity
   - Verify `NEXT_PUBLIC_BACKEND_URL` is correct
   - Check browser console for errors

3. **Phone number validation errors**:
   - Ensure phone number is 10 digits (will be auto-formatted with +91)
   - Check backend validation schema

### Debug Steps:

1. Open browser developer tools
2. Check Network tab for API calls
3. Check Console for error messages
4. Verify environment variables are set correctly
5. Test backend API directly with Postman/curl

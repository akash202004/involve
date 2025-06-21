// Cloudinary Configuration for Frontend
export const CLOUDINARY_CONFIG = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'akashlaha',
  uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'ml_default',
  uploadUrl: `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'akashlaha'}/image/upload`
};

// Instructions for setup:
// 1. Create a .env.local file in your frontend directory
// 2. Add these variables:
//    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=akashlaha
//    NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your-upload-preset-name
// 3. Replace 'your-upload-preset-name' with your actual upload preset name
// 4. Make sure your upload preset is set to "Unsigned" in Cloudinary dashboard 

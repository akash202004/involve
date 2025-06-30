// Job service utilities for backend communication

export interface JobData {
  userId: string;
  workerId?: string;
  specializations:
    | "plumber"
    | "electrician"
    | "carpenter"
    | "mechanic"
    | "mens_grooming"
    | "women_grooming";
  description: string;
  location: string;
  lat: number;
  lng: number;
  status?: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled";
  bookedFor?: string;
  durationMinutes: number;
}

export interface JobResponse {
  id: string;
  userId: string;
  workerId?: string;
  specializations: string;
  description: string;
  location: string;
  lat: number;
  lng: number;
  status: string;
  bookedFor?: string;
  durationMinutes: number;
  createdAt: string;
}

/**
 * Helper function to validate and format coordinates
 * @param lat - Latitude value
 * @param lng - Longitude value
 * @returns Formatted coordinates or throws error
 */
export const validateAndFormatCoordinates = (lat: any, lng: any): { lat: number; lng: number } => {
  // Convert to numbers if they're strings
  const latNum = typeof lat === 'string' ? parseFloat(lat) : lat;
  const lngNum = typeof lng === 'string' ? parseFloat(lng) : lng;

  // Validate coordinates
  if (latNum === null || latNum === undefined || isNaN(latNum)) {
    throw new Error('Invalid latitude value');
  }
  if (lngNum === null || lngNum === undefined || isNaN(lngNum)) {
    throw new Error('Invalid longitude value');
  }

  // Validate coordinate ranges
  if (latNum < -90 || latNum > 90) {
    throw new Error('Latitude must be between -90 and 90');
  }
  if (lngNum < -180 || lngNum > 180) {
    throw new Error('Longitude must be between -180 and 180');
  }

  return {
    lat: latNum,
    lng: lngNum
  };
};

/**
 * Create a new job in the backend
 * @param jobData - Job data to create
 * @returns Created job object
 */
export const createJob = async (jobData: JobData): Promise<JobResponse> => {
  try {
    console.log("🚀 [JOB_SERVICE] Creating job:", jobData);
    console.log("📍 [JOB_SERVICE] Coordinates validation:");
    console.log("  - lat:", jobData.lat, "type:", typeof jobData.lat);
    console.log("  - lng:", jobData.lng, "type:", typeof jobData.lng);
    console.log("  - lat is valid:", !isNaN(jobData.lat) && jobData.lat !== null && jobData.lat !== undefined);
    console.log("  - lng is valid:", !isNaN(jobData.lng) && jobData.lng !== null && jobData.lng !== undefined);
    
    // Validate and format coordinates
    const validatedCoords = validateAndFormatCoordinates(jobData.lat, jobData.lng);
    const validatedJobData = {
      ...jobData,
      lat: validatedCoords.lat,
      lng: validatedCoords.lng
    };
    
    console.log("✅ [JOB_SERVICE] Validated coordinates:", validatedCoords);
    
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"
      }/api/v1/jobs`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validatedJobData),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ [JOB_SERVICE] Job creation failed:", errorData);
      throw new Error(
        errorData.error || errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    const result = await response.json();
    console.log("✅ [JOB_SERVICE] Job created successfully:", result.data);
    return result.data;
  } catch (error) {
    console.error("❌ [JOB_SERVICE] Error creating job:", error);
    throw error;
  }
};

/**
 * Get job by ID from backend
 * @param jobId - Job ID
 * @returns Job object or null if not found
 */
export const getJobById = async (
  jobId: string
): Promise<JobResponse | null> => {
  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"
      }/api/v1/jobs/${jobId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        console.log("Job not found for ID:", jobId);
        return null;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const job = await response.json();
    return job;
  } catch (error) {
    console.error("Error fetching job by ID:", error);
    return null;
  }
};

/**
 * Update job status
 * @param jobId - Job ID
 * @param status - New status
 * @returns Updated job object
 */
export const updateJobStatus = async (
  jobId: string,
  status: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled"
): Promise<JobResponse> => {
  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"
      }/api/v1/jobs/${jobId}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || `HTTP error! status: ${response.status}`
      );
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error updating job status:", error);
    throw error;
  }
};

/**
 * Get all jobs for a user
 * @param userId - User ID
 * @returns Array of job objects
 */
export const getUserJobs = async (userId: string): Promise<JobResponse[]> => {
  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"
      }/api/v1/jobs/user/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error("Error fetching user jobs:", error);
    throw error;
  }
};

/**
 * Helper function to map service category to job specialization
 * @param serviceCategory - Service category from services.ts
 * @returns Job specialization
 */
export const mapServiceCategoryToSpecialization = (
  serviceCategory: string
):
  | "plumber"
  | "electrician"
  | "carpenter"
  | "mechanic"
  | "mens_grooming"
  | "women_grooming" => {
  const categoryMap: Record<string, any> = {
    "Plumbing Services": "plumber",
    "Electrical Services": "electrician",
    "Carpenter Services": "carpenter",
    "Mechanic Services": "mechanic",
    "Grooming Services": "mens_grooming",
    "Beauty Services": "women_grooming",
    "Hair Services": "mens_grooming",
    "Massage Services": "mens_grooming",
    "Cleaning Services": "plumber", // Default to plumber for cleaning
    "Appliance Repair": "electrician", // Default to electrician for appliance repair
    "Painting Services": "carpenter", // Default to carpenter for painting
    "Pest Control": "plumber", // Default to plumber for pest control
  };

  return categoryMap[serviceCategory] || "plumber";
};

/**
 * Helper function to create job description from service details
 * @param serviceName - Name of the service
 * @param serviceDescription - Description of the service
 * @returns Formatted job description
 */
export const createJobDescription = (
  serviceName: string,
  serviceDescription: string
): string => {
  return `Service requested: ${serviceName}. ${serviceDescription}. Please provide professional service as per customer requirements.`;
};

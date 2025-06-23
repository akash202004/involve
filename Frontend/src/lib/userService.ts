// User service utilities for backend communication

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: number;
  autoLocation?: string;
  lat?: number;
  lng?: number;
  createdAt: string;
}

/**
 * Get user by email from backend
 * @param email - User's email address
 * @returns User object or null if not found
 */
export const getUserByEmail = async (email: string): Promise<User | null> => {
  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"
      }/api/v1/users/email/${encodeURIComponent(email)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        console.log("User not found for email:", email);
        return null;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const user = await response.json();
    return user;
  } catch (error) {
    console.error("Error fetching user by email:", error);
    return null;
  }
};

/**
 * Create a new user in the backend
 * @param userData - User data to create
 * @returns Created user object
 */
export const createUser = async (
  userData: Omit<User, "id" | "createdAt">
): Promise<User> => {
  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"
      }/api/v1/users`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
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
    console.error("Error creating user:", error);
    throw error;
  }
};

/**
 * Get or create user by email
 * If user doesn't exist, creates a new user with basic info
 * @param email - User's email address
 * @param userInfo - Additional user info for creation if needed
 * @returns User object
 */
export const getOrCreateUserByEmail = async (
  email: string,
  userInfo?: {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
  }
): Promise<User> => {
  try {
    // First, try to get existing user
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      console.log("Found existing user:", existingUser.id);
      return existingUser;
    }

    // If user doesn't exist, create a new one
    console.log("Creating new user for email:", email);

    const cleanPhone = (userInfo?.phoneNumber || "919999999999").replace(
      /[^0-9]/g,
      ""
    );
    const newUserData = {
      firstName: userInfo?.firstName || "User",
      lastName: userInfo?.lastName || "Name",
      email: email,
      phoneNumber: cleanPhone,
      address: "",
      city: "",
      state: "",
      country: "",
    };

    const newUser = await createUser(newUserData);
    console.log("Created new user:", newUser.id);
    return newUser;
  } catch (error) {
    console.error("Error in getOrCreateUserByEmail:", error);
    throw error;
  }
};

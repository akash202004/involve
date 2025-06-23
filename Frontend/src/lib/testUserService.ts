// Test script for user service functionality
// This can be run in the browser console to test the user service

import {
  getUserByEmail,
  createUser,
  getOrCreateUserByEmail,
} from "./userService";

export const testUserService = async () => {
  console.log("🧪 Testing User Service...");

  const testEmail = "test@example.com";

  try {
    // Test 1: Get user by email (should return null for non-existent user)
    console.log("📧 Test 1: Getting user by email...");
    const existingUser = await getUserByEmail(testEmail);
    console.log("Result:", existingUser);

    // Test 2: Create a new user
    console.log("👤 Test 2: Creating new user...");
    const newUserData = {
      firstName: "Test",
      lastName: "User",
      email: testEmail,
      phoneNumber: "+91 1234567890",
      address: "Test Address",
      city: "Test City",
      state: "Test State",
      country: "India",
    };

    const createdUser = await createUser(newUserData);
    console.log("Created user:", createdUser);

    // Test 3: Get user by email again (should return the created user)
    console.log("📧 Test 3: Getting user by email again...");
    const retrievedUser = await getUserByEmail(testEmail);
    console.log("Retrieved user:", retrievedUser);

    // Test 4: Test getOrCreateUserByEmail with existing user
    console.log(
      "🔄 Test 4: Testing getOrCreateUserByEmail with existing user..."
    );
    const userOrCreated = await getOrCreateUserByEmail(testEmail);
    console.log("User or created:", userOrCreated);

    // Test 5: Test getOrCreateUserByEmail with new user
    console.log("🔄 Test 5: Testing getOrCreateUserByEmail with new user...");
    const newEmail = "newuser@example.com";
    const newUserOrCreated = await getOrCreateUserByEmail(newEmail, {
      firstName: "New",
      lastName: "User",
      phoneNumber: "+91 9876543210",
    });
    console.log("New user or created:", newUserOrCreated);

    console.log("✅ All tests completed successfully!");
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
};

// Export for use in browser console
if (typeof window !== "undefined") {
  (window as any).testUserService = testUserService;
}

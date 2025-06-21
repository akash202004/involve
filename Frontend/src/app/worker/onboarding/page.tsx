"use client";

import { useState, ChangeEvent, FormEvent, useRef, useEffect } from "react";
import styles from "./onboarding.module.css"; // This path is correct if both files are in the same folder.
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useUser } from "@civic/auth/react";
import { CLOUDINARY_CONFIG } from "../../config/cloudinary";

// --- Icon Components ---
const CameraIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="40"
    height="40"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={styles.uploaderIcon}
  >
    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path>
    <circle cx="12" cy="13" r="3"></circle>
  </svg>
);
const CrossIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);
const LocationPinIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"></path>
  </svg>
);

// Function to format phone number with country code
const formatPhoneNumber = (phoneNumber: string): string => {
  // Remove any existing country code or special characters
  const cleanNumber = phoneNumber.replace(/^\+91/, "").replace(/\D/g, "");

  // Validate it's a 10-digit number
  if (cleanNumber.length !== 10) {
    throw new Error("Phone number must be exactly 10 digits");
  }

  // Add +91 country code
  return `+91${cleanNumber}`;
};

// Function to validate phone number format
const validatePhoneNumber = (phoneNumber: string): boolean => {
  const cleanNumber = phoneNumber.replace(/^\+91/, "").replace(/\D/g, "");
  return cleanNumber.length === 10 && /^\d{10}$/.test(cleanNumber);
};

// Function to upload image to Cloudinary
const uploadImageToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  // Try with upload preset first
  if (
    CLOUDINARY_CONFIG.uploadPreset &&
    CLOUDINARY_CONFIG.uploadPreset !== "ml_default"
  ) {
    formData.append("upload_preset", CLOUDINARY_CONFIG.uploadPreset);
  }

  // Remove cloud_name from formData as it's already in the URL
  // formData.append('cloud_name', CLOUDINARY_CONFIG.cloudName);

  console.log("Uploading to Cloudinary:", {
    url: CLOUDINARY_CONFIG.uploadUrl,
    uploadPreset: CLOUDINARY_CONFIG.uploadPreset,
    fileName: file.name,
    fileSize: file.size,
  });

  try {
    const response = await fetch(CLOUDINARY_CONFIG.uploadUrl, {
      method: "POST",
      body: formData,
    });

    console.log("Cloudinary response status:", response.status);
    console.log("Cloudinary response headers:", response.headers);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Cloudinary error response:", errorText);

      // If upload preset fails, try without it (for testing)
      if (response.status === 400 && errorText.includes("upload_preset")) {
        console.log("Trying without upload preset...");
        const fallbackFormData = new FormData();
        fallbackFormData.append("file", file);

        const fallbackResponse = await fetch(CLOUDINARY_CONFIG.uploadUrl, {
          method: "POST",
          body: fallbackFormData,
        });

        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          console.log("Fallback upload successful:", fallbackData);
          return fallbackData.secure_url;
        } else {
          const fallbackErrorText = await fallbackResponse.text();
          console.error("Fallback upload failed:", fallbackErrorText);
        }
      }

      throw new Error(
        `Cloudinary upload failed: ${response.status} - ${errorText}`
      );
    }

    const data = await response.json();
    console.log("Cloudinary success response:", data);
    return data.secure_url; // Return the secure URL
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error(
      `Failed to upload image to Cloudinary: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

export default function WorkerOnboardingPage() {
  const router = useRouter();
  const { user } = useUser();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    password: "",
    profilePicture: null as File | null,
    profilePictureUrl: "", // New field to store the uploaded image URL
    address: "",
    description: "",
    phoneNumber: "",
    dateOfBirth: "",
    gender: "not_specified",
    experienceYears: "0",
    panCard: "",
    phoneOtp: "",
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [verification, setVerification] = useState({
    phoneOtpSent: false,
    phoneVerified: false,
    phoneLoading: false,
  });
  const [locationState, setLocationState] = useState({
    loading: false,
    error: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [submissionStatus, setSubmissionStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // Effect to auto-fill email from user profile
  useEffect(() => {
    if (user?.email) {
      setFormData((prev) => ({ ...prev, email: user.email || "" }));
    }
  }, [user]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, profilePicture: file }));
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    if (file) setImagePreview(URL.createObjectURL(file));
    else setImagePreview(null);
  };

  const handleRemoveImage = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    setFormData((prev) => ({
      ...prev,
      profilePicture: null,
      profilePictureUrl: "",
    }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendOtp = () =>
    setVerification((prev) => ({ ...prev, phoneOtpSent: true }));

  const handleVerifyOtp = () => {
    if (verification.phoneLoading) return;
    setVerification((prev) => ({ ...prev, phoneLoading: true }));
    setTimeout(() => {
      if (formData.phoneOtp.length === 6 && /^\d{6}$/.test(formData.phoneOtp)) {
        setVerification((prev) => ({
          ...prev,
          phoneVerified: true,
          phoneLoading: false,
        }));
      } else {
        setVerification((prev) => ({ ...prev, phoneLoading: false }));
        alert("Invalid OTP format. Please enter 6 digits.");
      }
    }, 1500);
  };

  // Function to get current location
  const handleFetchLocation = () => {
    if (!navigator.geolocation) {
      setLocationState({
        loading: false,
        error: "Geolocation is not supported by your browser.",
      });
      return;
    }

    setLocationState({ loading: true, error: "" });

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Using a free reverse geocoding API
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          const data = await response.json();
          const address = `${data.city}, ${data.principalSubdivision}, ${data.countryName}`;
          setFormData((prev) => ({ ...prev, address }));
          setLocationState({ loading: false, error: "" });
        } catch (error) {
          setLocationState({
            loading: false,
            error: "Failed to fetch address.",
          });
        }
      },
      () => {
        setLocationState({
          loading: false,
          error: "Unable to retrieve your location. Please grant permission.",
        });
      }
    );
  };

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("You must be logged in to submit a profile.");
      return;
    }

    // Validate phone number before submission
    if (!validatePhoneNumber(formData.phoneNumber)) {
      setErrorMessage("Please enter a valid 10-digit phone number.");
      setSubmissionStatus("error");
      return;
    }

    setSubmissionStatus("loading");
    setErrorMessage("");

    console.log("Form data before submission:", formData);

    try {
      let profilePictureUrl = "";

      // Upload image to Cloudinary if profile picture exists
      if (formData.profilePicture) {
        try {
          profilePictureUrl = await uploadImageToCloudinary(
            formData.profilePicture
          );
          console.log("Image uploaded successfully:", profilePictureUrl);
        } catch (uploadError) {
          console.error("Image upload failed:", uploadError);
          setErrorMessage(
            "Failed to upload profile picture. Please try again."
          );
          setSubmissionStatus("error");
          return;
        }
      }

      // Format phone number with country code
      const formattedPhoneNumber = formatPhoneNumber(formData.phoneNumber);
      console.log("Formatted phone number:", formattedPhoneNumber);

      // Create JSON data for API submission (no FormData needed since we have the URL)
      const apiData = {
        firstName: formData.firstName,
        middleName: formData.middleName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        address: formData.address,
        description: formData.description,
        phoneNumber: formattedPhoneNumber, // Use the formatted phone number
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        experienceYears: formData.experienceYears,
        panCard: formData.panCard,
        profilePictureUrl: profilePictureUrl, // Send the URL instead of file
      };

      console.log("API data being sent:", apiData);

      // Make API call to your backend
      const response = await fetch("http://localhost:5000/api/v1/workers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Successfully created worker:", result);
        setSubmissionStatus("success");

        // Store in localStorage as backup
        localStorage.setItem(
          `workerProfile_${user.email}`,
          JSON.stringify({
            ...formData,
            phoneNumber: formattedPhoneNumber, // Store formatted number
            profilePictureUrl: profilePictureUrl,
          })
        );

        setTimeout(() => router.push("/worker/dashboard"), 1500);
      } else {
        const errorResult = await response.json();
        console.error("Submission failed:", errorResult);
        setErrorMessage(errorResult.message || "Failed to create profile.");
        setSubmissionStatus("error");
      }
    } catch (error) {
      console.error("Network error:", error);
      setErrorMessage("Network error occurred. Please try again.");
      setSubmissionStatus("error");
    }
  };

  const RequiredStar = () => <span className={styles.requiredStar}>*</span>;

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.formContainer}>
        <header className={styles.header}>
          <h1>Join Our Professional Network</h1>
          <p>Complete your profile to start accepting jobs.</p>
        </header>
        <div className={styles.stepper}>
          <div
            className={`${styles.step} ${
              currentStep >= 1 ? styles.active : ""
            }`}
          >
            <div className={styles.stepNumber}>1</div>
            <div className={styles.stepLabel}>Personal Details</div>
          </div>
          <div className={styles.stepConnector}></div>
          <div
            className={`${styles.step} ${
              currentStep >= 2 ? styles.active : ""
            }`}
          >
            <div className={styles.stepNumber}>2</div>
            <div className={styles.stepLabel}>Professional Info</div>
          </div>
          <div className={styles.stepConnector}></div>
          <div
            className={`${styles.step} ${
              currentStep >= 3 ? styles.active : ""
            }`}
          >
            <div className={styles.stepNumber}>3</div>
            <div className={styles.stepLabel}>Profile Photo</div>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          {currentStep === 1 && (
            <fieldset className={styles.fieldset}>
              <legend className={styles.legend}>
                Personal & Contact Details
              </legend>
              <div className={styles.gridThreeCol}>
                <div className={styles.formGroup}>
                  <label htmlFor="firstName">
                    First Name <RequiredStar />
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="middleName">Middle Name</label>
                  <input
                    type="text"
                    id="middleName"
                    name="middleName"
                    value={formData.middleName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="lastName">
                    Last Name <RequiredStar />
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className={styles.gridTwoCol}>
                <div className={styles.formGroup}>
                  <label htmlFor="dateOfBirth">
                    Date of Birth <RequiredStar />
                  </label>
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="gender">Gender</label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                  >
                    <option value="not_specified">Do not specify</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="email">
                  Email <RequiredStar />
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  className={styles.readOnlyInput}
                  readOnly
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Create a password (optional)"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="phoneNumber">
                  Phone Number <RequiredStar />
                </label>
                <div className={styles.inputWithButton}>
                  <div className={styles.phoneInputWrapper}>
                    <span className={styles.countryCode}>+91</span>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      pattern="\d{10}"
                      title="Enter a 10-digit mobile number"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      required
                      disabled={verification.phoneVerified}
                    />
                  </div>
                  {!verification.phoneVerified && (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={
                        verification.phoneLoading || !formData.phoneNumber
                      }
                    >
                      {verification.phoneOtpSent ? "Resend OTP" : "Send OTP"}
                    </button>
                  )}
                  {verification.phoneVerified && (
                    <span className={styles.verifiedText}>✓ Verified</span>
                  )}
                </div>
                {verification.phoneOtpSent && !verification.phoneVerified && (
                  <div className={styles.otpSection}>
                    <input
                      type="text"
                      name="phoneOtp"
                      placeholder="Enter 6-digit OTP"
                      maxLength={6}
                      value={formData.phoneOtp}
                      onChange={handleInputChange}
                    />
                    <button
                      type="button"
                      className={styles.verifyButton}
                      onClick={handleVerifyOtp}
                      disabled={verification.phoneLoading}
                    >
                      {verification.phoneLoading ? (
                        <div className={styles.spinner}></div>
                      ) : (
                        "Verify"
                      )}
                    </button>
                  </div>
                )}
              </div>
            </fieldset>
          )}

          {currentStep === 2 && (
            <fieldset className={styles.fieldset}>
              <legend className={styles.legend}>
                Professional & Location Details
              </legend>
              <div className={styles.formGroup}>
                <label htmlFor="address">Address</label>
                <div className={styles.addressInputWrapper}>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    className={`${styles.nonResizable} ${styles.addressTextarea}`}
                    placeholder="Click the icon to get current location"
                  />
                  <button
                    type="button"
                    onClick={handleFetchLocation}
                    className={styles.locationIconButton}
                    disabled={locationState.loading}
                    title="Get Current Location"
                  >
                    {locationState.loading ? (
                      <div className={styles.spinner} />
                    ) : (
                      <LocationPinIcon />
                    )}
                  </button>
                </div>
                {locationState.error && (
                  <p
                    style={{
                      color: "red",
                      fontSize: "0.8rem",
                      marginTop: "4px",
                    }}
                  >
                    {locationState.error}
                  </p>
                )}
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="description">Description (Bio)</label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Describe your skills and services..."
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className={styles.nonResizable}
                />
              </div>
              <div className={styles.gridTwoCol}>
                <div className={styles.formGroup}>
                  <label htmlFor="experienceYears">Experience (Years)</label>
                  <input
                    type="number"
                    id="experienceYears"
                    name="experienceYears"
                    min="0"
                    max="60"
                    value={formData.experienceYears}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="panCard">PAN Card</label>
                  <input
                    type="text"
                    id="panCard"
                    name="panCard"
                    value={formData.panCard}
                    onChange={handleInputChange}
                    pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                    title="Enter a valid PAN card number"
                  />
                </div>
              </div>
            </fieldset>
          )}

          {currentStep === 3 && (
            <fieldset className={styles.fieldset}>
              <legend className={styles.legend}>Profile Picture</legend>
              <div className={`${styles.formGroup} ${styles.uploaderGroup}`}>
                <label className={styles.mainUploaderLabel}>
                  A clear photo helps clients trust you.
                </label>
                <div className={styles.profilePicContainer}>
                  <label
                    htmlFor="profilePicture"
                    className={styles.profilePicUploader}
                  >
                    {imagePreview ? (
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        layout="fill"
                        objectFit="cover"
                      />
                    ) : (
                      <div className={styles.uploadPlaceholder}>
                        <CameraIcon />
                        <span>Upload Photo</span>
                      </div>
                    )}
                  </label>
                  {imagePreview && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className={styles.removePicButton}
                    >
                      <CrossIcon />
                    </button>
                  )}
                  <input
                    type="file"
                    id="profilePicture"
                    className={styles.fileInputHidden}
                    onChange={handleFileChange}
                    accept="image/png, image/jpeg"
                    ref={fileInputRef}
                  />
                </div>
                <p className={styles.uploaderHelpText}>
                  Supports: JPG, PNG | Max Size: 5MB
                </p>
              </div>
            </fieldset>
          )}

          <div className={styles.formNavigation}>
            {currentStep > 1 && (
              <button
                type="button"
                className={styles.backButton}
                onClick={prevStep}
              >
                Back
              </button>
            )}
            {currentStep < 3 && (
              <button
                type="button"
                className={styles.nextButton}
                onClick={nextStep}
              >
                Next
              </button>
            )}
            {currentStep === 3 && (
              <button
                type="submit"
                className={styles.submitButton}
                disabled={submissionStatus === "loading"}
              >
                Submit Profile
              </button>
            )}
          </div>
        </form>
      </div>

      {submissionStatus !== "idle" && (
        <div className={styles.submissionOverlay}>
          <div className={styles.submissionContent}>
            {submissionStatus === "loading" && (
              <>
                <div className={styles.spinner}></div>
                <p>Submitting your profile...</p>
              </>
            )}
            {submissionStatus === "success" && (
              <div className={styles.successAnimation}>
                <svg
                  className={styles.checkmark}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 52 52"
                >
                  <circle
                    className={styles.checkmarkCircle}
                    cx="26"
                    cy="26"
                    r="25"
                    fill="none"
                  />
                  <path
                    className={styles.checkmarkCheck}
                    fill="none"
                    d="M14.1 27.2l7.1 7.2 16.7-16.8"
                  />
                </svg>
                <p>Profile Created Successfully!</p>
              </div>
            )}
            {submissionStatus === "error" && (
              <div className={styles.errorAnimation}>
                <svg
                  className={styles.errorIcon}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
                <p>Error: {errorMessage}</p>
                <button
                  onClick={() => setSubmissionStatus("idle")}
                  className={styles.retryButton}
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

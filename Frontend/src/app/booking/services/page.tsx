"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "../cart/cartContext";
import { getOrCreateUserByEmail } from "@/lib/userService";
import { useUser, useSignIn } from "@clerk/nextjs";
import { useToast } from "@/components/Toast";
import {
  BookingProgress,
  ButtonLoader,
  PageLoadAnimation,
  PulsingDots,
} from "@/components/LoadingAnimations";
import {
  getCurrentLocationWithAddress,
  formatAddress,
} from "@/lib/addressService";
import { ModernInput, ModernButton } from "@/components/ModernUI";
import mockWorkers from "./mockWorkers";
import { ALL_SERVICES, type ServiceDetails } from "@/lib/services";
import { loadStripe } from "@stripe/stripe-js";
import { createCustomerPayment } from "@/lib/stripe";
import {
  createJob,
  mapServiceCategoryToSpecialization,
  createJobDescription,
  validateAndFormatCoordinates,
  type JobData,
} from "@/lib/jobService";

// Use the shared service details instead of duplicating
const SERVICE_DETAILS: Record<string, ServiceDetails> = ALL_SERVICES;

// Memoized function to parse duration to minutes
const parseDurationToMinutes = (duration: string): number => {
  const timeMatch = duration.match(/(\d+)-(\d+)\s*(min|hour|h)/);
  if (!timeMatch) return 60; // Default to 60 minutes

  const [, minStr, maxStr, unit] = timeMatch;
  const min = parseInt(minStr);
  const max = parseInt(maxStr);

  if (unit === "hour" || unit === "h") {
    return Math.round(((min + max) / 2) * 60);
  } else {
    return Math.round((min + max) / 2);
  }
};

const ServiceBookingPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToCart, cart } = useCart();
  const { user, isSignedIn, isLoaded } = useUser();
  const { signIn } = useSignIn();
  const { showToast } = useToast();

  // Initialize Stripe at the beginning to maintain hook order
  const stripePromise = useMemo(() => {
    return loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }, []);

  // State management
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("");
  const [coupon, setCoupon] = useState<string>("");
  const [couponApplied, setCouponApplied] = useState<boolean>(false);
  const [discount, setDiscount] = useState<number>(0);
  const [isBookingConfirmed, setIsBookingConfirmed] = useState<boolean>(false);
  const [nearbyWorkerCount, setNearbyWorkerCount] = useState<number | null>(
    null
  );
  const [assignedWorker, setAssignedWorker] = useState<any>(null);
  const [showWorkerModal, setShowWorkerModal] = useState(false);

  // Loading states for cool animations
  const [bookingStage, setBookingStage] = useState<
    | "idle"
    | "initiating"
    | "getting-location"
    | "creating-user"
    | "creating-job"
    | "redirecting"
  >("idle");
  const [isPageLoading, setIsPageLoading] = useState<boolean>(true);

  // Address state
  const [address, setAddress] = useState<string>("");
  const [addressLoading, setAddressLoading] = useState<boolean>(true);
  const [addressError, setAddressError] = useState<string>("");

  // New state for job data
  const [jobDataForBooking, setJobDataForBooking] = useState<any>(null);
  const [userDataForBooking, setUserDataForBooking] = useState<any>(null);

  // Get service name from URL params
  const serviceName = searchParams.get("service");

  // Page load animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 1500); // Show loading animation for 1.5 seconds

    return () => clearTimeout(timer);
  }, []);

  // Fetch address on mount
  useEffect(() => {
    let isMounted = true;
    setAddressLoading(true);
    getCurrentLocationWithAddress()
      .then((loc) => {
        if (isMounted) {
          setAddress(formatAddress(loc.address));
          setAddressLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setAddressError(
            "Could not fetch address automatically. Please enter manually."
          );
          setAddressLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Memoize current service to prevent unnecessary re-renders
  const currentService = useMemo(() => {
    if (!serviceName || !SERVICE_DETAILS[serviceName]) {
      return SERVICE_DETAILS["Haircut"]; // Default service
    }
    return SERVICE_DETAILS[serviceName];
  }, [serviceName]);

  // Memoize cart check to prevent unnecessary re-renders
  const isInCart = useMemo(() => {
    return cart.some(
      (item) =>
        item.name === currentService.name &&
        item.category === currentService.category
    );
  }, [cart, currentService.name, currentService.category]);

  // Memoize final price calculation
  const finalPrice = useMemo(() => {
    return currentService.price - discount;
  }, [currentService.price, discount]);

  // Optimized booking handler with useCallback and cool animations
  const handleBooking = useCallback(async () => {
    console.log("🚀 [BOOKING] Starting booking process...");
    console.log("👤 [BOOKING] User:", user);
    console.log("💳 [BOOKING] Payment method:", selectedPaymentMethod);
    console.log("📍 [BOOKING] Address:", address);

    // Check if user is signed in
    if (!isSignedIn || !user) {
      console.log("❌ [BOOKING] User not signed in, redirecting to sign in...");
      showToast("Please sign in to continue with booking", "warning");
      try {
        await signIn();
      } catch (err) {
        console.error("❌ [BOOKING] Sign-in failed:", err);
        showToast("Sign-in failed. Please try again.", "error");
      }
      return;
    }

    // Check if user has email (with better error handling)
    const userEmail =
      user.primaryEmailAddress?.emailAddress ||
      user.emailAddresses?.[0]?.emailAddress;
    if (!userEmail) {
      console.error("❌ [BOOKING] No user email found");
      showToast(
        "Email address not found. Please update your profile or sign in again.",
        "error"
      );
      return;
    }

    if (!("geolocation" in navigator)) {
      console.error("❌ [BOOKING] Geolocation not supported");
      showToast("Geolocation is not supported by your browser.", "error");
      return;
    }

    if (selectedPaymentMethod) {
      console.log("✅ [BOOKING] All checks passed, starting booking...");
      showToast("Starting your booking process...", "info");
      setIsBookingConfirmed(true);
      setBookingStage("initiating");

      try {
        // Get user data from backend (ensure user exists)
        setBookingStage("creating-user");
        console.log("👤 [BOOKING] Ensuring user exists in backend...");
        const userData = await getOrCreateUserByEmail(userEmail, {
          firstName: user.firstName,
          lastName: user.lastName,
          phoneNumber: user.phoneNumbers?.[0]?.phoneNumber,
        });
        console.log("✅ [BOOKING] User data retrieved:", userData.id);

        // Get current location
        setBookingStage("getting-location");
        console.log("📍 [BOOKING] Getting current location...");

        let locationData;
        try {
          locationData = await getCurrentLocationWithAddress();
          console.log("✅ [BOOKING] Location data:", locationData);
        } catch (locationError) {
          console.warn(
            "⚠️ [BOOKING] Location service failed, using fallback coordinates:",
            locationError
          );
          // Fallback to default coordinates (Kolkata, India)
          locationData = {
            formattedAddress: address || "Kolkata, West Bengal, India",
            coordinates: {
              lat: 22.5726,
              lng: 88.3639,
            },
          };
        }

        // Validate coordinates
        if (!locationData.coordinates.lat || !locationData.coordinates.lng) {
          console.error("❌ [BOOKING] Invalid coordinates received");
          showToast("Unable to get your location. Please try again.", "error");
          setIsBookingConfirmed(false);
          setBookingStage("idle");
          return;
        }

        // Validate and format coordinates
        let validatedCoords;
        try {
          validatedCoords = validateAndFormatCoordinates(
            locationData.coordinates.lat, 
            locationData.coordinates.lng
          );
          console.log("✅ [BOOKING] Coordinates validated:", validatedCoords);
        } catch (coordError) {
          console.error("❌ [BOOKING] Coordinate validation failed:", coordError);
          showToast("Invalid location data. Please try again.", "error");
          setIsBookingConfirmed(false);
          setBookingStage("idle");
          return;
        }

        // Create job data
        const jobData: JobData = {
          userId: userData.id,
          specializations: mapServiceCategoryToSpecialization(
            currentService.category
          ),
          description: createJobDescription(
            currentService.name,
            currentService.description
          ),
          location: address || locationData.formattedAddress,
          lat: validatedCoords.lat,
          lng: validatedCoords.lng,
          status: "pending",
          bookedFor: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Book for tomorrow
          durationMinutes: parseDurationToMinutes(currentService.duration),
        };

        console.log("📝 [BOOKING] Job data prepared:", jobData);

        if (selectedPaymentMethod === "online") {
          // Handle online payment - create job first, then redirect to Stripe
          console.log("💳 [BOOKING] Processing online payment...");
          console.log(
            "🔑 [BOOKING] Stripe key configured:",
            !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
          );
          showToast(
            "Creating job and redirecting to secure payment...",
            "info"
          );

          // Test mode: bypass Stripe only if key is missing
          const isTestMode = !process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

          if (isTestMode) {
            console.log(
              "Test mode: Stripe key not configured, creating job and simulating payment"
            );

            // Create job in backend
            setBookingStage("creating-job");
            const createdJob = await createJob(jobData);
            console.log(
              "✅ [BOOKING] Job created in test mode:",
              createdJob.id
            );

            showToast(
              "Test mode: Job created and payment would be processed",
              "success"
            );
            setTimeout(() => {
              setIsBookingConfirmed(false);
              setBookingStage("idle");
              router.push(
                `/booking/payment-success?session_id=test_session_${Date.now()}&jobId=${
                  createdJob.id
                }`
              );
            }, 1500);
            return;
          }

          // Create job in backend first
          setBookingStage("creating-job");
          const createdJob = await createJob(jobData);
          console.log(
            "✅ [BOOKING] Job created for online payment:",
            createdJob.id
          );

          console.log("🔗 [BOOKING] Creating Stripe payment session...");
          try {
            const { sessionId } = await createCustomerPayment(
              finalPrice,
              currentService.name,
              userEmail,
              user.id
            );

            console.log("✅ [BOOKING] Payment session created:", sessionId);

            // Redirect to Stripe Checkout
            const stripe = await stripePromise;
            if (stripe) {
              console.log("🔄 [BOOKING] Redirecting to Stripe checkout...");
              const { error } = await stripe.redirectToCheckout({ sessionId });
              if (error) {
                console.error("❌ [BOOKING] Stripe redirect error:", error);
                showToast("Payment failed. Please try again.", "error");
                setIsBookingConfirmed(false);
                setBookingStage("idle");
              }
            } else {
              throw new Error("Stripe failed to load");
            }
          } catch (paymentError) {
            console.error(
              "❌ [BOOKING] Payment creation failed:",
              paymentError
            );
            showToast(
              "Payment service unavailable. Please try cash on delivery.",
              "error"
            );
            setIsBookingConfirmed(false);
            setBookingStage("idle");
          }
        } else {
          // Handle cash on delivery - create job and assign worker
          console.log("💵 [BOOKING] Processing cash on delivery...");
          showToast(
            "Creating job and processing cash on delivery booking...",
            "info"
          );

          // Create job in backend
          setBookingStage("creating-job");
          const createdJob = await createJob(jobData);
          console.log("✅ [BOOKING] Job created for COD:", createdJob.id);

          // Simulate worker assignment
          const randomWorker =
            mockWorkers[Math.floor(Math.random() * mockWorkers.length)];
          setTimeout(() => {
            setIsBookingConfirmed(false);
            setBookingStage("idle");
            setAddress("");
            showToast(
              "Job created and booking confirmed! Redirecting to worker assignment...",
              "success"
            );
            router.push(
              `/booking/worker-assigned?id=${randomWorker.id}&paymentMethod=cash&jobId=${createdJob.id}`
            );
          }, 1500);
        }
      } catch (error) {
        console.error("❌ [BOOKING] Booking failed:", error);
        setIsBookingConfirmed(false);
        setBookingStage("idle");
        showToast("Booking failed. Please try again.", "error");
      }
    } else {
      showToast("Please select a payment method", "warning");
    }
  }, [
    user,
    isSignedIn,
    signIn,
    selectedPaymentMethod,
    currentService,
    router,
    address,
    finalPrice,
    discount,
    couponApplied,
    coupon,
    showToast,
    stripePromise,
  ]);

  // Handler for when workers are found
  const handleWorkerFound = (count: number) => {
    setNearbyWorkerCount(count);
    if (count > 0) {
      showToast(
        `${count} worker${count > 1 ? "s" : ""} found nearby!`,
        "success"
      );
    } else {
      showToast("No workers available in your area at the moment.", "warning");
    }
  };

  // Optimized coupon handler with useCallback
  const handleApplyCoupon = useCallback(() => {
    if (coupon.trim().toUpperCase() === "USER25") {
      setDiscount(Math.round(currentService.price * 0.25));
      setCouponApplied(true);
      showToast("Coupon applied successfully! 25% discount added.", "success");
    } else {
      setDiscount(0);
      setCouponApplied(false);
      showToast("Invalid coupon code. Please try again.", "error");
    }
  }, [coupon, currentService.price, showToast]);

  // Optimized cart handler with useCallback
  const handleAddToCart = useCallback(() => {
    if (!isInCart) {
      addToCart({
        name: currentService.name,
        price: currentService.price,
        category: currentService.category,
      });
      // Note: The toast is already handled in the cart context
    } else {
      showToast("Service is already in your cart!", "info");
    }
  }, [isInCart, addToCart, currentService, showToast]);

  // Show loading while Clerk is loading user data
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-white mt-28 flex items-center justify-center">
        <PageLoadAnimation />
      </div>
    );
  }

  // Show sign-in prompt if user is not signed in
  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-white mt-28 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Sign In Required
          </h2>
          <p className="text-gray-600 mb-6">
            Please sign in to book this service.
          </p>
          <button
            onClick={() => signIn()}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
          >
            Sign In to Continue
          </button>
        </div>
      </div>
    );
  }

  // Show page loading animation
  if (isPageLoading) {
    return (
      <div className="min-h-screen bg-white mt-28 flex items-center justify-center">
        <PageLoadAnimation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4 sm:space-x-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-2xl sm:text-3xl">
                  {currentService.icon}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 passion-one-black leading-tight">
                  {currentService.name}
                </h1>
                <p className="text-gray-600 text-sm sm:text-lg mt-1">
                  {currentService.category}
                </p>
              </div>
            </div>
            <button
              onClick={() => router.back()}
              className="bg-gray-100 hover:bg-gray-200 rounded-full p-2 sm:p-3 transition-colors duration-200 self-start sm:self-auto"
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-6 sm:gap-8 lg:flex-row">
          {/* Left Column - Service Details */}
          <div className="space-y-6 flex-1">
            {/* Service Information */}
            <div className="rounded-xl p-4 sm:p-6 lg:p-8">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 passion-one-black text-gray-800">
                Service Details
              </h2>
              <div className="space-y-4 sm:space-y-6">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600 font-medium text-sm sm:text-base">
                    Duration:
                  </span>
                  <span className="font-semibold text-gray-800 text-sm sm:text-base">
                    {currentService.duration}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600 font-medium text-sm sm:text-base">
                    Price:
                  </span>
                  <span className="font-bold text-2xl sm:text-3xl text-yellow-600">
                    ₹{currentService.price}
                  </span>
                </div>
                <div className="pt-3">
                  <span className="text-gray-600 font-medium block mb-2 text-sm sm:text-base">
                    Description:
                  </span>
                  <p className="text-gray-800 leading-relaxed text-sm sm:text-base">
                    {currentService.description}
                  </p>
                </div>
              </div>
              <button
                className={`mt-6 w-full py-3 rounded-xl font-semibold text-base sm:text-lg transition-all duration-200 ${
                  isInCart
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-yellow-500 hover:bg-yellow-600 text-white shadow-lg hover:shadow-xl"
                }`}
                onClick={handleAddToCart}
                disabled={isInCart}
              >
                {isInCart ? (
                  <div className="flex items-center justify-center space-x-2">
                    <span>Added to Cart</span>
                    <PulsingDots />
                  </div>
                ) : (
                  "Add to Cart"
                )}
              </button>
            </div>
          </div>

          {/* Right Column - Booking Summary */}
          <div className="flex-1 min-w-0 lg:min-w-[320px] lg:max-w-[400px]">
            <div className="rounded-xl p-4 sm:p-6 lg:p-8 bg-gray-50">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 passion-one-black text-gray-800">
                Booking Summary
              </h2>

              {/* User Info */}
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs sm:text-sm font-medium text-green-800">
                      Signed in as
                    </div>
                    <div className="text-xs sm:text-sm text-green-700 truncate">
                      {user?.primaryEmailAddress?.emailAddress ||
                        user?.emailAddresses?.[0]?.emailAddress ||
                        "Loading..."}
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Input */}
              <div className="mb-4 sm:mb-6">
                <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                  Your Address
                </label>
                <ModernInput
                  value={address}
                  onChange={setAddress}
                  placeholder="Enter your address"
                  icon={null}
                  disabled={addressLoading}
                  error={addressError}
                  className="mb-2"
                />
                {addressLoading && (
                  <div className="text-yellow-600 text-xs sm:text-sm flex items-center gap-2 animate-pulse">
                    <span>Fetching your address...</span>
                  </div>
                )}
                {addressError && (
                  <div className="text-red-500 text-xs sm:text-sm mt-1">
                    {addressError}
                  </div>
                )}
              </div>

              {/* Coupon Input */}
              <div className="mb-4 sm:mb-6">
                <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                  Apply Coupon
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    className="flex-1 p-2 sm:p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-800 text-sm sm:text-base"
                    placeholder="Enter coupon code"
                    disabled={couponApplied}
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={couponApplied}
                    className={`px-3 sm:px-4 py-2 rounded-lg border-2 font-semibold transition-colors duration-200 text-sm sm:text-base whitespace-nowrap ${
                      couponApplied
                        ? "bg-green-200 border-green-400 text-green-800 cursor-not-allowed"
                        : "bg-white border-black text-black hover:bg-[#fdc700]"
                    }`}
                  >
                    {couponApplied ? "Applied" : "Apply"}
                  </button>
                </div>
                {couponApplied && (
                  <p className="text-green-600 text-xs sm:text-sm mt-2">
                    Coupon applied! 25% discount
                  </p>
                )}
              </div>

              {/* Payment Method */}
              <div className="mb-4 sm:mb-6">
                <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                  Payment Method
                </label>
                <div className="space-y-3">
                  <label className="flex items-start space-x-3 cursor-pointer p-3 border-2 border-gray-200 rounded-lg hover:border-yellow-500 transition-colors duration-200">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={selectedPaymentMethod === "cash"}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                      className="text-yellow-500 focus:ring-yellow-500 mt-1"
                    />
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-3 h-3 sm:w-5 sm:h-5 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                          ></path>
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="font-medium text-gray-800 text-sm sm:text-base block">
                          Cash on Delivery
                        </span>
                        <p className="text-xs text-gray-500 mt-1">
                          Pay when service is completed
                        </p>
                      </div>
                    </div>
                  </label>
                  <label className="flex items-start space-x-3 cursor-pointer p-3 border-2 border-gray-200 rounded-lg hover:border-yellow-500 transition-colors duration-200">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="online"
                      checked={selectedPaymentMethod === "online"}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                      className="text-yellow-500 focus:ring-yellow-500 mt-1"
                    />
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-3 h-3 sm:w-5 sm:h-5 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                          ></path>
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="font-medium text-gray-800 text-sm sm:text-base block">
                          Online Payment
                        </span>
                        <p className="text-xs text-gray-500 mt-1">
                          Pay securely with credit/debit card
                        </p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-4 sm:mb-6">
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-gray-600">Service Price:</span>
                  <span className="font-semibold">₹{currentService.price}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600 text-sm sm:text-base">
                    <span>Discount:</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
                <div className="border-t pt-3">
                  <div className="flex justify-between text-base sm:text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-yellow-600">₹{finalPrice}</span>
                  </div>
                </div>
              </div>

              {/* Book Now Button */}
              <ModernButton
                onClick={handleBooking}
                disabled={
                  !selectedPaymentMethod ||
                  isBookingConfirmed ||
                  addressLoading ||
                  !address
                }
                loading={isBookingConfirmed}
                className="w-full py-3 sm:py-4 mt-2"
              >
                {isBookingConfirmed
                  ? "Looking for worker near you..."
                  : "Book Now"}
              </ModernButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceBookingPage;

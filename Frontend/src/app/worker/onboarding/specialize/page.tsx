"use client";

import { useState, useEffect, Suspense, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./specialize.module.css";

// --- Data based on your database enums ---
const categories = [
  { id: "plumber", name: "Plumber", icon: "💧" },
  { id: "electrician", name: "Electrician", icon: "⚡" },
  { id: "carpenter", name: "Carpenter", icon: "🔨" },
  { id: "mechanic", name: "Mechanic", icon: "🔧" },
  { id: "mens_grooming", name: "Men's Grooming", icon: "💈" },
  { id: "women_grooming", name: "Women's Grooming", icon: "💅" },
];

const subCategoryMap: Record<string, string[]> = {
  plumber: ["Tape Repair", "Leak Fixing", "Pipe Installation", "Drain Cleaning", "Toilet Repair", "Water Heater Repair"],
  electrician: ["Electrical Repair", "Wiring Installation", "Switch & Socket Repair", "Fan Installation", "Light Installation", "MCB or Fuse Repair"],
  carpenter: ["Wood Work", "Furniture Assembly", "Door/Window Repair", "Cabinet Installation", "Custom Shelves"],
  mechanic: ["Car Service", "Bike Service", "Emergency Service", "Tire Change"],
  mens_grooming: ["Haircut", "Shaving", "Facial", "Hair Color", "Massage"],
  women_grooming: ["Facial", "Hair Color", "Body Massage"],
};

// Mapping from display names to backend enum values - EXACTLY matching schema
const subCategoryEnumMap: Record<string, string> = {
  // Plumber
  "Tape Repair": "tape_repair",
  "Leak Fixing": "leak_fixing", 
  "Pipe Installation": "pipe_installation",
  "Drain Cleaning": "drain_cleaning",
  "Toilet Repair": "toilet_repair",
  "Water Heater Repair": "water_repair",
  
  // Electrician
  "Electrical Repair": "electrical_repair",
  "Wiring Installation": "wiring_installation",
  "Switch & Socket Repair": "switch_and_socket_repair",
  "Fan Installation": "fan_installation",
  "Light Installation": "light_installation",
  "MCB or Fuse Repair": "mcb_or_fuse_repair",
  
  // Carpenter
  "Wood Work": "wood_work",
  "Furniture Assembly": "furniture_assembly",
  "Door/Window Repair": "window_repair",
  "Cabinet Installation": "cabinate_installation",
  "Custom Shelves": "custom_shelves",
  
  // Mechanic
  "Car Service": "car_service",
  "Bike Service": "bike_service",
  "Emergency Service": "emergency_service",
  "Tire Change": "tire_change",
  
  // Men's Grooming
  "Haircut": "haircut",
  "Shaving": "saving",
  "Facial": "facial",
  "Hair Color": "hair_color",
  "Massage": "full_body_massage",
  
  // Women's Grooming
  "Body Massage": "body_massage",
};

// --- Helper Components ---
const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function SpecializationFormComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const workerId = searchParams.get("workerId");

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubCategories, setSelectedSubCategories] = useState<Set<string>>(new Set());
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string>("");
  const [isCheckingSpecializations, setIsCheckingSpecializations] = useState(true);

  useEffect(() => {
    if (!workerId) {
      alert("Worker ID not found. Redirecting to onboarding.");
      router.push("/worker/onboarding");
      return;
    }
    
    // Check if worker already has specializations
    checkExistingSpecializations();
  }, [workerId, router]);

  const checkExistingSpecializations = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/v1/specializations/worker/${workerId}`);
      
      if (response.ok) {
        const specializations = await response.json();
        if (specializations.length > 0) {
          // Worker already has specializations, redirect to dashboard
          console.log("Worker already has specializations:", specializations);
          router.push("/worker/dashboard");
          return;
        }
      }
      
      // No specializations found or error, show specialization form
      setIsCheckingSpecializations(false);
    } catch (error) {
      console.error("Error checking specializations:", error);
      setIsCheckingSpecializations(false);
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedSubCategories(new Set()); // Reset skills when profession changes
  };

  const handleSubCategoryToggle = (subCategory: string) => {
    setSelectedSubCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(subCategory)) {
        newSet.delete(subCategory);
      } else {
        newSet.add(subCategory);
      }
      return newSet;
    });
  };

  const availableSubCategories = useMemo(() => {
    if (!selectedCategory) return [];
    return subCategoryMap[selectedCategory] || [];
  }, [selectedCategory]);

  const handleFinish = async () => {
    if (!selectedCategory || selectedSubCategories.size === 0) {
      setError("Please choose a profession and select at least one skill.");
      return;
    }
    
    if (!workerId) {
      setError("Worker ID is missing. Please try again.");
      return;
    }
    
    setStatus("loading");
    setError("");

    // Create submission data with proper enum values
    const submissionData = Array.from(selectedSubCategories).map(subCategory => {
      const enumValue = subCategoryEnumMap[subCategory];
      if (!enumValue) {
        throw new Error(`Invalid subcategory: ${subCategory}`);
      }
      
      return {
        workerId,
        category: selectedCategory,
        subCategory: enumValue,
      };
    });

    console.log('Worker ID:', workerId);
    console.log('Submission data:', submissionData);

    try {
      // Submit each specialization individually
      const submissionPromises = submissionData.map(data => 
        fetch("http://localhost:5000/api/v1/specializations", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify(data),
        })
      );

      const responses = await Promise.all(submissionPromises);
      
      // Check for any failed responses (excluding 409 Conflict for duplicates)
      const failedResponses = responses.filter(res => !res.ok && res.status !== 409);
      
      if (failedResponses.length > 0) {
        const firstFailedResponse = failedResponses[0];
        const errorData = await firstFailedResponse.json();
        console.error('Specialization creation error:', errorData);
        
        // Show validation errors if present
        if (errorData.errors && Array.isArray(errorData.errors)) {
          setError(errorData.errors.map((e: { field: string; message: string }) => `${e.field}: ${e.message}`).join(' | '));
        } else {
          setError(errorData.message || errorData.error || `An error occurred: Status ${firstFailedResponse.status}`);
        }
        throw new Error(errorData.message || errorData.error || `An error occurred: Status ${firstFailedResponse.status}`);
      }

      setStatus("success");
      setTimeout(() => router.push("/worker/dashboard"), 1500);

    } catch (err: any) {
      setStatus("error");
      setError(err.message || "An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className={styles.container}>
      {/* Show loading screen while checking specializations */}
      {isCheckingSpecializations && (
        <div className={styles.overlay}>
          <div className={styles.successBox}>
            <div className={styles.spinner} style={{ margin: '0 auto 1rem auto', width: '40px', height: '40px' }}></div>
            <h3>Checking your specializations...</h3>
            <p>Please wait while we verify your profile.</p>
          </div>
        </div>
      )}
      
      <div className={styles.content}>
        {/* Don't show form while checking specializations */}
        {!isCheckingSpecializations && (
          <>
            <header className={styles.header}>
              <h1>Tell us what you do</h1>
              <p>Your profession helps us find the right jobs for you.</p>
            </header>

            <section className={styles.stepSection}>
              <h2><span className={styles.stepNumber}>1</span> Choose Your Profession</h2>
              <div className={styles.categoryGrid}>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    className={`${styles.categoryCard} ${selectedCategory === cat.id ? styles.selected : ""}`}
                    onClick={() => handleCategorySelect(cat.id)}
                  >
                    <span className={styles.cardIcon}>{cat.icon}</span>
                    <span className={styles.cardName}>{cat.name}</span>
                  </button>
                ))}
              </div>
            </section>

            {selectedCategory && (
              <section className={`${styles.stepSection} ${styles.fadeIn}`}>
                <h2><span className={styles.stepNumber}>2</span> Select Your Skills</h2>
                <div className={styles.subCategoryGrid}>
                  {availableSubCategories.map((subCat) => (
                    <label key={subCat} className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        className={styles.hiddenCheckbox}
                        checked={selectedSubCategories.has(subCat)}
                        onChange={() => handleSubCategoryToggle(subCat)}
                      />
                      <span className={styles.customCheckbox}>
                        <CheckIcon />
                      </span>
                      <span className={styles.checkboxText}>{subCat}</span>
                    </label>
                  ))}
                </div>
              </section>
            )}
            
            <div className={styles.footer}>
              {error && <p className={styles.errorMessage}>{error}</p>}
              <button
                className={styles.submitButton}
                onClick={handleFinish}
                disabled={!selectedCategory || selectedSubCategories.size === 0 || status === 'loading'}
              >
                {status === 'loading' ? 'Saving...' : 'Complete Profile'}
              </button>
            </div>
          </>
        )}
      </div>

      {status === 'success' && (
         <div className={styles.overlay}>
            <div className={styles.successBox}>
                ✅
                <h3>Profile Complete!</h3>
                <p>Redirecting you to your dashboard...</p>
            </div>
        </div>
      )}
    </div>
  );
}

export default function SpecializationPage() {
  return (
    <Suspense fallback={<div>Loading Your Profile...</div>}>
      <SpecializationFormComponent />
    </Suspense>
  );
}
"use client";

import { useState, ChangeEvent, FormEvent, useRef, useEffect } from 'react';
import styles from './onboarding.module.css'; // This path is correct if both files are in the same folder.
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useUser } from '@civic/auth/react';

// --- Icon Components ---
const CameraIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={styles.uploaderIcon}><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path><circle cx="12" cy="13" r="3"></circle></svg>);
const CrossIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>);
const LocationPinIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"></path></svg>);

export default function WorkerOnboardingPage() {
  const router = useRouter();
  const { user } = useUser();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    password: '',
    profilePicture: null as File | null,
    address: '',
    description: '',
    phoneNumber: '',
    dateOfBirth: '',
    gender: 'not_specified',
    experienceYears: '0',
    panCard: '',
    phoneOtp: '',
  });
  
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [verification, setVerification] = useState({
    phoneOtpSent: false,
    phoneVerified: false,
    phoneLoading: false,
  });
  const [locationState, setLocationState] = useState({
    loading: false,
    error: '',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  // Effect to auto-fill email from user profile
  useEffect(() => {
    if (user?.email) {
      setFormData(prev => ({ ...prev, email: user.email }));
    }
  }, [user]);


  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, profilePicture: file }));
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    if (file) setImagePreview(URL.createObjectURL(file));
    else setImagePreview(null);
  };

  const handleRemoveImage = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    setFormData(prev => ({ ...prev, profilePicture: null }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendOtp = () => setVerification(prev => ({ ...prev, phoneOtpSent: true }));
  
  const handleVerifyOtp = () => {
    if (verification.phoneLoading) return;
    setVerification(prev => ({ ...prev, phoneLoading: true }));
    setTimeout(() => {
      if (formData.phoneOtp.length === 6 && /^\d{6}$/.test(formData.phoneOtp)) {
        setVerification(prev => ({ ...prev, phoneVerified: true, phoneLoading: false }));
      } else {
        setVerification(prev => ({ ...prev, phoneLoading: false }));
        alert("Invalid OTP format. Please enter 6 digits.");
      }
    }, 1500);
  };

  // Function to get current location
  const handleFetchLocation = () => {
    if (!navigator.geolocation) {
      setLocationState({ loading: false, error: "Geolocation is not supported by your browser." });
      return;
    }
    
    setLocationState({ loading: true, error: "" });

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Using a free reverse geocoding API
          const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
          const data = await response.json();
          const address = `${data.city}, ${data.principalSubdivision}, ${data.countryName}`;
          setFormData(prev => ({ ...prev, address }));
          setLocationState({ loading: false, error: "" });
        } catch (error) {
          setLocationState({ loading: false, error: "Failed to fetch address." });
        }
      },
      () => {
        
        setLocationState({ loading: false, error: "Unable to retrieve your location. Please grant permission." });
      }
    );
  };

  const nextStep = () => setCurrentStep(prev => prev + 1);
  const prevStep = () => setCurrentStep(prev => prev - 1);
  
  const handleSubmit = (e: FormEvent) => { 
    e.preventDefault(); 
    if (!user) {
      alert("You must be logged in to submit a profile.");
      return;
    }
    
    setSubmissionStatus('loading');
    
    setTimeout(() => {
      console.log("Submitting data:", formData);
      localStorage.setItem(`workerProfile_${user.did}`, JSON.stringify(formData));
      setSubmissionStatus('success');
      setTimeout(() => router.push('/worker/dashboard'), 1500); 
    }, 2000); 
  };

  const RequiredStar = () => <span className={styles.requiredStar}>*</span>;

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.formContainer}>
        <header className={styles.header}><h1>Join Our Professional Network</h1><p>Complete your profile to start accepting jobs.</p></header>
        <div className={styles.stepper}>
          <div className={`${styles.step} ${currentStep >= 1 ? styles.active : ''}`}><div className={styles.stepNumber}>1</div><div className={styles.stepLabel}>Personal Details</div></div>
          <div className={styles.stepConnector}></div>
          <div className={`${styles.step} ${currentStep >= 2 ? styles.active : ''}`}><div className={styles.stepNumber}>2</div><div className={styles.stepLabel}>Professional Info</div></div>
          <div className={styles.stepConnector}></div>
          <div className={`${styles.step} ${currentStep >= 3 ? styles.active : ''}`}><div className={styles.stepNumber}>3</div><div className={styles.stepLabel}>Profile Photo</div></div>
        </div>
        <form onSubmit={handleSubmit}>
          {currentStep === 1 && (
            <fieldset className={styles.fieldset}>
              <legend className={styles.legend}>Personal & Contact Details</legend>
              <div className={styles.gridThreeCol}>
                  <div className={styles.formGroup}><label htmlFor="firstName">First Name <RequiredStar/></label><input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} required/></div>
                  <div className={styles.formGroup}><label htmlFor="middleName">Middle Name</label><input type="text" id="middleName" name="middleName" value={formData.middleName} onChange={handleInputChange}/></div>
                  <div className={styles.formGroup}><label htmlFor="lastName">Last Name <RequiredStar/></label><input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} required/></div>
              </div>
              <div className={styles.gridTwoCol}>
                  <div className={styles.formGroup}><label htmlFor="dateOfBirth">Date of Birth <RequiredStar/></label><input type="date" id="dateOfBirth" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleInputChange} required/></div>
                  <div className={styles.formGroup}><label htmlFor="gender">Gender</label><select id="gender" name="gender" value={formData.gender} onChange={handleInputChange}><option value="not_specified">Do not specify</option><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></select></div>
              </div>
              <div className={styles.formGroup}><label htmlFor="email">Email <RequiredStar/></label><input type="email" id="email" name="email" value={formData.email} className={styles.readOnlyInput} readOnly required/></div>
              <div className={styles.formGroup}><label htmlFor="password">Password</label><input type="password" id="password" name="password" placeholder="Create a password (optional)" value={formData.password} onChange={handleInputChange}/></div>
              <div className={styles.formGroup}>
                  <label htmlFor="phoneNumber">Phone Number <RequiredStar/></label>
                  <div className={styles.inputWithButton}>
                      <div className={styles.phoneInputWrapper}><span className={styles.countryCode}>+91</span><input type="tel" id="phoneNumber" name="phoneNumber" pattern="\d{10}" title="Enter a 10-digit mobile number" value={formData.phoneNumber} onChange={handleInputChange} required disabled={verification.phoneVerified}/></div>
                      {!verification.phoneVerified && <button type="button" onClick={handleSendOtp} disabled={verification.phoneLoading || !formData.phoneNumber}>{verification.phoneOtpSent?'Resend OTP':'Send OTP'}</button>}
                      {verification.phoneVerified && <span className={styles.verifiedText}>✓ Verified</span>}
                  </div>
                  {verification.phoneOtpSent && !verification.phoneVerified && (<div className={styles.otpSection}><input type="text" name="phoneOtp" placeholder="Enter 6-digit OTP" maxLength={6} value={formData.phoneOtp} onChange={handleInputChange}/><button type="button" className={styles.verifyButton} onClick={handleVerifyOtp} disabled={verification.phoneLoading}>{verification.phoneLoading ? <div className={styles.spinner}></div> : 'Verify'}</button></div>)}
              </div>
            </fieldset>
          )}

          {currentStep === 2 && (
            <fieldset className={styles.fieldset}>
              <legend className={styles.legend}>Professional & Location Details</legend>
              <div className={styles.formGroup}>
                <label htmlFor="address">Address</label>
                <div className={styles.addressInputWrapper}>
                  <textarea id="address" name="address" value={formData.address} onChange={handleInputChange} rows={3} className={`${styles.nonResizable} ${styles.addressTextarea}`} placeholder="Click the icon to get current location"/>
                  <button type="button" onClick={handleFetchLocation} className={styles.locationIconButton} disabled={locationState.loading} title="Get Current Location">
                    {locationState.loading ? <div className={styles.spinner} /> : <LocationPinIcon />}
                  </button>
                </div>
                {locationState.error && <p style={{color: 'red', fontSize: '0.8rem', marginTop: '4px'}}>{locationState.error}</p>}
              </div>
              <div className={styles.formGroup}><label htmlFor="description">Description (Bio)</label><textarea id="description" name="description" placeholder="Describe your skills and services..." value={formData.description} onChange={handleInputChange} rows={4} className={styles.nonResizable}/></div>
              <div className={styles.gridTwoCol}>
                <div className={styles.formGroup}><label htmlFor="experienceYears">Experience (Years)</label><input type="number" id="experienceYears" name="experienceYears" min="0" max="60" value={formData.experienceYears} onChange={handleInputChange} /></div>
                <div className={styles.formGroup}><label htmlFor="panCard">PAN Card</label><input type="text" id="panCard" name="panCard" value={formData.panCard} onChange={handleInputChange} pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}" title="Enter a valid PAN card number"/></div>
              </div>
            </fieldset>
          )}

          {currentStep === 3 && (
             <fieldset className={styles.fieldset}>
              <legend className={styles.legend}>Profile Picture</legend>
               <div className={`${styles.formGroup} ${styles.uploaderGroup}`}>
                <label className={styles.mainUploaderLabel}>A clear photo helps clients trust you.</label>
                <div className={styles.profilePicContainer}>
                  <label htmlFor="profilePicture" className={styles.profilePicUploader}>{imagePreview ? <Image src={imagePreview} alt="Preview" layout="fill" objectFit="cover"/> : <div className={styles.uploadPlaceholder}><CameraIcon/><span>Upload Photo</span></div>}</label>
                  {imagePreview && <button type="button" onClick={handleRemoveImage} className={styles.removePicButton}><CrossIcon/></button>}
                  <input type="file" id="profilePicture" className={styles.fileInputHidden} onChange={handleFileChange} accept="image/png, image/jpeg" ref={fileInputRef}/>
                </div>
                <p className={styles.uploaderHelpText}>Supports: JPG, PNG | Max Size: 5MB</p>
              </div>
            </fieldset>
          )}
          
          <div className={styles.formNavigation}>
              {currentStep > 1 && (<button type="button" className={styles.backButton} onClick={prevStep}>Back</button>)}
              {currentStep < 3 && (<button type="button" className={styles.nextButton} onClick={nextStep}>Next</button>)}
              {currentStep === 3 && (<button type="submit" className={styles.submitButton}>Submit Profile</button>)}
          </div>
        </form>
      </div>

      {submissionStatus !== 'idle' && (
        <div className={styles.submissionOverlay}>
          <div className={styles.submissionContent}>
            {submissionStatus === 'loading' && (<><div className={styles.spinner}></div><p>Submitting your profile...</p></>)}
            {submissionStatus === 'success' && (<div className={styles.successAnimation}><svg className={styles.checkmark} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"><circle className={styles.checkmarkCircle} cx="26" cy="26" r="25" fill="none"/><path className={styles.checkmarkCheck} fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/></svg><p>Profile Created Successfully!</p></div>)}
          </div>
        </div>
      )}
    </div>
  );
}


 /*const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("You must be logged in to submit a profile.");
      return;
    }

    setSubmissionStatus('loading');

    // 1. Create a FormData object to hold all the data
    const apiFormData = new FormData();

    // 2. Append all the fields from your state.
    // The key (e.g., "firstName") MUST match what your backend API expects.
    apiFormData.append("firstName", formData.firstName);
    apiFormData.append("middleName", formData.middleName);
    apiFormData.append("lastName", formData.lastName);
    apiFormData.append("email", formData.email);
    apiFormData.append("password", formData.password);
    apiFormData.append("address", formData.address);
    apiFormData.append("description", formData.description);
    // Combine country code with the 10-digit number
    apiFormData.append("phoneNumber", `+91${formData.phoneNumber}`);
    apiFormData.append("dateOfBirth", formData.dateOfBirth);
    apiFormData.append("gender", formData.gender);
    apiFormData.append("experienceYears", formData.experienceYears);
    apiFormData.append("panCard", formData.panCard);

    // 3. Append the profile picture file, if it exists
    if (formData.profilePicture) {
      apiFormData.append("profilePicture", formData.profilePicture);
    }

    try {
      // 4. Make the API call using fetch
      const response = await fetch('/api/workers', { // <-- This is your backend API endpoint
        method: 'POST',
        body: apiFormData,
        // IMPORTANT: DO NOT set the 'Content-Type' header yourself.
        // The browser will automatically set it to 'multipart/form-data'
        // with the correct boundary when you use FormData.
      });

      // 5. Handle the response
      if (response.ok) {
        const result = await response.json();
        console.log('Successfully created worker:', result);
        setSubmissionStatus('success');
        setTimeout(() => router.push('/worker/dashboard'), 1500);
      } else {
        // Handle server-side errors (e.g., validation failed)
        const errorResult = await response.json();
        console.error('Submission failed:', errorResult);
        alert(`Error: ${errorResult.message || 'Failed to create profile.'}`);
        setSubmissionStatus('idle'); // Reset the form to allow another attempt
      }
    } catch (error) {
      // Handle network errors (e.g., server is down)
      console.error('An error occurred during submission:', error);
      alert('A network error occurred. Please try again.');
      setSubmissionStatus('idle');
    }
  }; */